namespace Platform.Application.Features.GeneralParameters.Dtos;

public class GeneralParameterListItem
{
    public string Code { get; set; } = default!;
    public string? ParentCode { get; set; }
    public string Label { get; set; } = default!;
    public int OrderIndex { get; set; }
}
