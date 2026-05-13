using CodePro.Application.Features.Manufacturers.Dtos;
using CodePro.Application.Interfaces;
using CodePro.Domain.Entities.Products;
using Platform.Application.Common.Results;
using Platform.Application.Interfaces;
using Mapster;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace CodePro.Application.Features.Manufacturers.Commands.CreateManufacturer;

public sealed class CreateManufacturerHandler : IRequestHandler<CreateManufacturerCommand, Result<ManufacturerDetailItem>>
{
    private readonly IManufacturerRepository _repository;
    private readonly IAttachmentRepository _attachmentRepository;
    private readonly ICodeProDbContext _db;

    public CreateManufacturerHandler(
        IManufacturerRepository repository,
        IAttachmentRepository attachmentRepository,
        ICodeProDbContext db)
    {
        _repository = repository;
        _attachmentRepository = attachmentRepository;
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

        if (request.Attachments.Count > 0)
        {
            var metadataIds = request.Attachments.Select(a => a.MetadataId).ToList();
            await _attachmentRepository.AssociateAsync(metadataIds, entity.Id, nameof(Manufacturer), cancellationToken);
        }

        return entity.Adapt<ManufacturerDetailItem>();
    }
}
