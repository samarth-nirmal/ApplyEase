using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace NaukriScraperApi.Model
{
    public class CoverLetterRequest
    {
        public int UserId { get; set; }
        public string? jobTitle {get; set;}
        public string? companyName { get; set; }
        public string JobDescription { get; set; } = string.Empty;
    }
}