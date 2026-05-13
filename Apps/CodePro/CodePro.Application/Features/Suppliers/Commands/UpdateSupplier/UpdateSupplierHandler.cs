using CodePro.Application.Features.Suppliers.Dtos;
using CodePro.Application.Interfaces;
using CodePro.Domain.Entities.Suppliers;
using Platform.Application.Common.Results;
using Platform.Application.Interfaces;
using Mapster;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace CodePro.Application.Features.Suppliers.Commands.UpdateSupplier;

public sealed class UpdateSupplierHandler : IRequestHandler<UpdateSupplierCommand, Result<SupplierDetailItem>>
{
    private readonly ISupplierRepository _repository;
    private readonly IAttachmentRepository _attachmentRepository;
    private readonly ICodeProDbContext _db;

    public UpdateSupplierHandler(
        ISupplierRepository repository,
        IAttachmentRepository attachmentRepository,
        ICodeProDbContext db)
    {
        _repository = repository;
        _attachmentRepository = attachmentRepository;
        _db = db;
    }

    public async Task<Result<SupplierDetailItem>> Handle(UpdateSupplierCommand request, CancellationToken cancellationToken)
    {
        var entity = await _repository.GetAsync(request.Id, cancellationToken);
        if (entity is null) return SupplierErrors.NotFound;

        if (!string.IsNullOrWhiteSpace(request.Vkn) && request.Vkn != entity.Vkn)
        {
            var duplicate = await _db.Supplier.AsNoTracking()
                .AnyAsync(s => s.Vkn == request.Vkn && s.Id != request.Id, cancellationToken);
            if (duplicate) return SupplierErrors.DuplicateVkn;
        }

        request.Adapt(entity);
        await _repository.UpdateAsync(entity, cancellationToken);

        if (request.Attachments.Count > 0)
        {
            var metadataIds = request.Attachments.Select(a => a.MetadataId).ToList();
            await _attachmentRepository.AssociateAsync(metadataIds, entity.Id, nameof(Supplier), cancellationToken);
        }

        return entity.Adapt<SupplierDetailItem>();
    }
}
