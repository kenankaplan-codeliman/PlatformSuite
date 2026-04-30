using CodePro.Application.Features.Manufacturers.Dtos;
using CodePro.Application.Interfaces;
using CodePro.Domain.Entities.Products;
using Platform.Application.Common.Results;
using Mapster;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace CodePro.Application.Features.Manufacturers.Commands.CreateManufacturer;

public sealed class CreateManufacturerHandler : IRequestHandler<CreateManufacturerCommand, Result<ManufacturerDetailItem>>
{
    private readonly IManufacturerRepository _repository;
    private readonly ICodeProDbContext _db;

    public CreateManufacturerHandler(IManufacturerRepository repository, ICodeProDbContext db)
    {
        _repository = repository;
        _db = db;
    }

    public async Task<Result<ManufacturerDetailItem>> Handle(CreateManufacturerCommand request, CancellationToken cancellationToken)
    {
        var nameExists = await _db.Manufacturer
            .AsNoTracking()
            .AnyAsync(m => m.Name.ToLower() == request.Name.ToLower(), cancellationToken);

        if (nameExists) return ManufacturerErrors.DuplicateName;

        var entity = request.Adapt<Manufacturer>();
        await _repository.CreateAsync(entity, cancellationToken);
        return entity.Adapt<ManufacturerDetailItem>();
    }
}
