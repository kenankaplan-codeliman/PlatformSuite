using Platform.Application.Common.Results;

namespace Crm.Application.Features.Leads;

public static class LeadErrors
{
    public static readonly Error NotFound =
        new("Lead.NotFound", "Aday bulunamadı.", ErrorType.NotFound);
}
