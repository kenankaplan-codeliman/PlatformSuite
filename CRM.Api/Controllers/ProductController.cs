using CRM.Api.Authorization;
using CRM.Api.Contracts.Requests.Common;
using CRM.Application.CommandHandler;
using CRM.Application.Modals.Common;
using CRM.Domain.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CRM.Api.Controllers;

[ApiController]
[Route("api/product")]
public class ProductController : ControllerBase
{
    private readonly ProductCommandHandler productCommandHandler;

    public ProductController(ProductCommandHandler opportunityCommandHandler)
    {
        this.productCommandHandler = opportunityCommandHandler;
    }


    [HttpPost("search")]
    [ProducesResponseType(typeof(EntityReferenceList), 200)]
    [PrivilegeAuthorize(PrivilegeCodes.ProductPrivilegeCodes.Read)]
    public async Task<IActionResult> BulkUpdateStatus(SearchRequest request)
    {
        var response = await productCommandHandler.LookupReference(request.SearchText, new PaginationInfo(request.Page, request.PageSize));
        return Ok(response);
    }
}
