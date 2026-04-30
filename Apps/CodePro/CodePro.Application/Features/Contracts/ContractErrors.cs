using Platform.Application.Common.Results;

namespace CodePro.Application.Features.Contracts;

public static class ContractErrors
{
    public static readonly Error NotFound =
        new("Contract.NotFound", "Sözleşme bulunamadı.", ErrorType.NotFound);

    public static readonly Error DuplicateContractNumber =
        new("Contract.DuplicateContractNumber", "Aynı numarada başka bir sözleşme kayıtlı.", ErrorType.Conflict);
}
