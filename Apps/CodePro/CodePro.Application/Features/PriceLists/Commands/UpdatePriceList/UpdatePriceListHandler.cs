using CodePro.Application.Features.PriceLists.Dtos;
using CodePro.Application.Interfaces;
using CodePro.Domain.Entities.Products;
using Platform.Application.Common.Results;
using Platform.Application.Interfaces;
using Mapster;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace CodePro.Application.Features.PriceLists.Commands.UpdatePriceList;

public sealed class UpdatePriceListHandler : IRequestHandler<UpdatePriceListCommand, Result<PriceListDetailItem>>
{
    private readonly IPriceListRepository _repository;
    private readonly IAttachmentRepository _attachmentRepository;
    private readonly ICodeProDbContext _db;

    public UpdatePriceListHandler(
        IPriceListRepository repository,
        IAttachmentRepository attachmentRepository,
        ICodeProDbContext db)
    {
        _repository = repository;
        _attachmentRepository = attachmentRepository;
        _db = db;
    }

    public async Task<Result<PriceListDetailItem>> Handle(UpdatePriceListCommand request, CancellationToken cancellationToken)
    {
        var entity = await _repository.GetAsync(request.Id, cancellationToken);
        if (entity is null) return PriceListErrors.NotFound;

        var supplierId = request.Supplier?.Id ?? Guid.Empty;
        var supplierExists = await _db.Supplier.AsNoTracking()
            .AnyAsync(a => a.Id == supplierId, cancellationToken);
        if (!supplierExists) return PriceListErrors.SupplierNotFound;

        var codeExists = await _db.PriceList.AsNoTracking()
            .AnyAsync(p => p.Id != request.Id && p.Code.ToLower() == request.Code.ToLower(), cancellationToken);
        if (codeExists) return PriceListErrors.DuplicateCode;

        entity.Code = request.Code;
        entity.Name = request.Name;
        entity.Description = request.Description;
        entity.SupplierId = supplierId;

        await _repository.UpdateAsync(entity, cancellationToken);

        if (request.Attachments.Count > 0)
        {
            var metadataIds = request.Attachments.Select(a => a.MetadataId).ToList();
            await _attachmentRepository.AssociateAsync(metadataIds, entity.Id, nameof(PriceList), cancellationToken);
        }

        var saved = await _db.PriceList.AsNoTracking()
            .Include(p => p.Supplier)
            .FirstAsync(p => p.Id == entity.Id, cancellationToken);
        return saved.Adapt<PriceListDetailItem>();
    }
}
