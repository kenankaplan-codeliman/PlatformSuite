using System;

namespace CRM.Api.Contracts.Responses;

public class ErrorResponse
{
    public string Code { get; set; } = null!;
    public string Message { get; set; } = null!;    
}
