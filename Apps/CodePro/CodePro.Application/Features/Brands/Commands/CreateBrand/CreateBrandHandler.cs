using CodePro.Application.Features.Brands.Dtos;
using CodePro.Application.Interfaces;
using CodePro.Domain.Entities.Products;
using Platform.Application.Common.Results;
using Mapster;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace CodePro.Application.Features.Brands.Commands.CreateBrand;

public sealed class CreateBrandHandler : IRequestHandler<CreateBrandCommand, Result<BrandDetailItem>>
{
    private readonly IBrandRepository _repository;
    private readonly ICodeProDbContext _db;

    public CreateBrandHandler(IBrandRepository repository, ICodeProDbContext db)
    {
        _repository = repository;
        _db = db;
    }

    public async Task<Result<BrandDetailItem>> Handle(CreateBrandCommand request, CancellationToken cancellationToken)
    {
        var nameExists = await _db.Brand
            .AsNoTracking()
            .AnyAsync(b => b.Name.ToLower() == request.Name.ToLower(), cancellationToken);

        if (nameExists) return BrandErrors.DuplicateName;

        var entity = request.Adapt<Brand>();
        await _repository.CreateAsync(entity, cancellationToken);
        return entity.Adapt<BrandDetailItem>();
    }
}
