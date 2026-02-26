using CRM.Application.Interfaces;
using CRM.Application.Modals.Common;
using CRM.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Text;

namespace CRM.Application.CommandHandler;

public class ProductCommandHandler
{
    private readonly IProductRepository productRepository;
    private readonly IReferenceRepository referenceRepository;
    private readonly IUnitOfWork unitOfWork;

    public ProductCommandHandler(IProductRepository productRepository, IReferenceRepository referenceRepository, IUnitOfWork unitOfWork)
    {
        this.productRepository = productRepository;
        this.referenceRepository = referenceRepository;
        this.unitOfWork = unitOfWork;
    }


    public async Task<EntityReferenceList> LookupReference(string searchText, PaginationInfo paginationInfo)
    {
        var result = referenceRepository.LookupReference(EntityType.Product, searchText, paginationInfo);

        return new EntityReferenceList()
        {
            Data = result.Data,
            HasMore = result.HasMore,
            Page = result.Page,
            PageSize = result.PageSize,
        };
    }
}
