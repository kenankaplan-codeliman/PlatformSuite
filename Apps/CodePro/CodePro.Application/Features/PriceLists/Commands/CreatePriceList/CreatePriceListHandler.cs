using CodePro.Application.Features.PriceLists.Dtos;
using CodePro.Application.Interfaces;
using CodePro.Domain.Entities.Products;
using Platform.Application.Common.Results;
using Mapster;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace CodePro.Application.Features.PriceLists.Commands.CreatePriceList;

public sealed class CreatePriceListHandler : IRequestHandler<CreatePriceListCommand, Result<PriceListDetailItem>>
{
    private readonly IPriceListRepository _repository;
    private readonly ICodeProDbContext _db;

    public CreatePriceListHandler(IPriceListRepository repository, ICodeProDbContext db)
    {
        _repository = repository;
        _db = db;
    }

    public async Task<Result<PriceListDetailItem>> Handle(CreatePriceListCommand request, CancellationToken cancellationToken)
    {
        var supplierId = request.SupplierAccount?.Id ?? Guid.Empty;
        var supplierExists = await _db.Account.AsNoTracking()
            .AnyAsync(a => a.Id == supplierId, cancellationToken);
        if (!supplierExists) return PriceListErrors.SupplierNotFound;

        var entity = request.Adapt<PriceList>();
        entity.Code = string.IsNullOrWhiteSpace(request.Code)
            ? await GenerateCodeAsync(cancellationToken)
            : request.Code.Trim();

        var codeExists = await _db.PriceList.AsNoTracking()
            .AnyAsync(p => p.Code.ToLower() == entity.Code.ToLower(), cancellationToken);
        if (codeExists) return PriceListErrors.DuplicateCode;

        await _repository.CreateAsync(entity, cancellationToken);

        return await BuildDetailAsync(entity.Id, cancellationToken);
    }

    private async Task<string> GenerateCodeAsync(CancellationToken cancellationToken)
    {
        var year = DateTime.UtcNow.Year;
        var prefix = $"PL-{year}-";
        var lastCode = await _db.PriceList.AsNoTracking()
            .Where(p => p.Code.StartsWith(prefix))
            .OrderByDescending(p => p.Code)
            .Select(p => p.Code)
            .FirstOrDefaultAsync(cancellationToken);

        var nextNumber = 1;
        if (!string.IsNullOrEmpty(lastCode))
        {
            var suffix = lastCode.Substring(prefix.Length);
            if (int.TryParse(suffix, out var n)) nextNumber = n + 1;
        }
        return $"{prefix}{nextNumber:D4}";
    }

    private async Task<PriceListDetailItem> BuildDetailAsync(Guid id, CancellationToken cancellationToken)
    {
        var entity = await _db.PriceList.AsNoTracking()
            .Include(p => p.SupplierAccount)
            .FirstAsync(p => p.Id == id, cancellationToken);
        return entity.Adapt<PriceListDetailItem>();
    }
}
