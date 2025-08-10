using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace NaukriScraperApi.Model
{
    public class Education
{
    public int Id { get; set; }

    public string SchoolName { get; set; }
    public string SchoolLocation { get; set; }

    public string FieldOfStudy { get; set; }
    public string Qualification { get; set; }

    public string GraduationYear { get; set; }
    public double PercentageOrCgpa { get; set; }

    public string Country { get; set; }

    public int UserResumeId { get; set; }
    public UserResume UserResume { get; set; }
}

}