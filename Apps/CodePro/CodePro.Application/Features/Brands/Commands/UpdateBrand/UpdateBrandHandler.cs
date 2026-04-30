using CodePro.Application.Features.Brands.Dtos;
using CodePro.Application.Interfaces;
using Platform.Application.Common.Results;
using Mapster;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace CodePro.Application.Features.Brands.Commands.UpdateBrand;

public sealed class UpdateBrandHandler : IRequestHandler<UpdateBrandCommand, Result<BrandDetailItem>>
{
    private readonly IBrandRepository _repository;
    private readonly ICodeProDbContext _db;

    public UpdateBrandHandler(IBrandRepository repository, ICodeProDbContext db)
    {
        _repository = repository;
        _db = db;
    }

    public async Task<Result<BrandDetailItem>> Handle(UpdateBrandCommand request, CancellationToken cancellationToken)
    {
        var entity = await _repository.GetAsync(request.Id, cancellationToken);
        if (entity is null) return BrandErrors.NotFound;

        var nameExists = await _db.Brand
            .AsNoTracking()
            .AnyAsync(b => b.Id != request.Id && b.Name.ToLower() == request.Name.ToLower(), cancellationToken);

        if (nameExists) return BrandErrors.DuplicateName;

        request.Adapt(entity);
        await _repository.UpdateAsync(entity, cancellationToken);
        return entity.Adapt<BrandDetailItem>();
    }
}
