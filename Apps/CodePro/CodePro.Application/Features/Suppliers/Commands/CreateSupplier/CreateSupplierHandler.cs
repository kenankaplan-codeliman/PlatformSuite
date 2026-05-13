using CodePro.Application.Features.Suppliers.Dtos;
using CodePro.Application.Interfaces;
using CodePro.Domain.Entities.Suppliers;
using Platform.Application.Common.Results;
using Platform.Application.Interfaces;
using Mapster;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace CodePro.Application.Features.Suppliers.Commands.CreateSupplier;

public sealed class CreateSupplierHandler : IRequestHandler<CreateSupplierCommand, Result<SupplierDetailItem>>
{
    private readonly ISupplierRepository _repository;
    private readonly IAttachmentRepository _attachmentRepository;
    private readonly ICodeProDbContext _db;

    public CreateSupplierHandler(
        ISupplierRepository repository,
        IAttachmentRepository attachmentRepository,
        ICodeProDbContext db)
    {
        _repository = repository;
        _attachmentRepository = attachmentRepository;
        _db = db;
    }

    public async Task<Result<SupplierDetailItem>> Handle(CreateSupplierCommand request, CancellationToken cancellationToken)
    {
        if (!string.IsNullOrWhiteSpace(request.Vkn))
        {
            var duplicate = await _db.Supplier.AsNoTracking()
                .AnyAsync(s => s.Vkn == request.Vkn, cancellationToken);
            if (duplicate) return SupplierErrors.DuplicateVkn;
        }

        var entity = request.Adapt<Supplier>();
        await _repository.CreateAsync(entity, cancellationToken);

        if (request.Attachments.Count > 0)
        {
            var metadataIds = request.Attachments.Select(a => a.MetadataId).ToList();
            await _attachmentRepository.AssociateAsync(metadataIds, entity.Id, nameof(Supplier), cancellationToken);
        }

        return entity.Adapt<SupplierDetailItem>();
    }
}
