using System;
using System.Collections.Generic;
using System.Text;

namespace CRM.Application.Modals.Common
{
    public class PaginationInfo
    {
        public PaginationInfo(int Page, int PageSize) { 
        
            this.Page = Page;
            this.PageSize = PageSize;
        } 

        public int Page { get; set; }
        public int PageSize { get; set; }

        public bool isValid() { 
            return PageSize > 0;
        }
    }
}
