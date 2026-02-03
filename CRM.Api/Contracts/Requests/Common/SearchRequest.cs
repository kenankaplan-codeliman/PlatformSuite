namespace CRM.Api.Contracts.Requests.Common
{
    public class SearchRequest
    {
        public int Page { get; set; }
        public int PageSize { get; set; }
        public string SearchText { get; set; } = string.Empty;
    }
}
