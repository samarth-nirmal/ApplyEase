using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace NaukriScraperApi.Model
{
    public class Job
{
    public int Id { get; set; }

    public string JobTitle { get; set; }
    public string CompanyName { get; set; }

    public string StartDate { get; set; }
    public string EndDate { get; set; }

    public string City { get; set; }
    public string Country { get; set; }

    public string Description { get; set; } // stored as HTML
    public bool CurrentlyWorking { get; set; }

    public int UserResumeId { get; set; }
    public UserResume UserResume { get; set; }
}

}