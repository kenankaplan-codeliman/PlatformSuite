using CodePro.Application.Features.Manufacturers.Dtos;
using CodePro.Application.Interfaces;
using Platform.Application.Common.Results;
using Mapster;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace CodePro.Application.Features.Manufacturers.Commands.UpdateManufacturer;

public sealed class UpdateManufacturerHandler : IRequestHandler<UpdateManufacturerCommand, Result<ManufacturerDetailItem>>
{
    private readonly IManufacturerRepository _repository;
    private readonly ICodeProDbContext _db;

    public UpdateManufacturerHandler(IManufacturerRepository repository, ICodeProDbContext db)
    {
        _repository = repository;
        _db = db;
    }

    public async Task<Result<ManufacturerDetailItem>> Handle(UpdateManufacturerCommand request, CancellationToken cancellationToken)
    {
        var entity = await _repository.GetAsync(request.Id, cancellationToken);
        if (entity is null) return ManufacturerErrors.NotFound;

        var nameExists = await _db.Manufacturer
            .AsNoTracking()
            .AnyAsync(m => m.Id != request.Id && m.Name.ToLower() == request.Name.ToLower(), cancellationToken);

        if (nameExists) return ManufacturerErrors.DuplicateName;

        request.Adapt(entity);
        await _repository.UpdateAsync(entity, cancellationToken);
        return entity.Adapt<ManufacturerDetailItem>();
    }
}
