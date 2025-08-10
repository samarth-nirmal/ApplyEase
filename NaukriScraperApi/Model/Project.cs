using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace NaukriScraperApi.Model
{
public class Project
{
    public int Id { get; set; }

    public string ProjectName { get; set; }

    public string ProjectDescription { get; set; } // stored as HTML
    public string TechnologiesUsed { get; set; }

    public int UserResumeId { get; set; }
    public UserResume UserResume { get; set; }
}

}