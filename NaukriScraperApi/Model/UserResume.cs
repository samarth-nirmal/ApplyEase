using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace NaukriScraperApi.Model
{
    public class UserResume
{
    public int Id { get; set; }

    public int UserId { get; set; }

    public string FirstName { get; set; }
    public string LastName { get; set; }

    public string City { get; set; }
    public string Country { get; set; }
    public string Pincode { get; set; }

    public string PhoneNumber { get; set; }
    public string Email { get; set; }

    public string Skills { get; set; } // stored as HTML
    public string Certifications { get; set; } // stored as HTML
    public string Achievements { get; set; } // stored as 
    
    public int resumeTemplateId { get; set; }

    public ICollection<Job> Jobs { get; set; }
    public ICollection<Education> Education { get; set; }
    public ICollection<Project> Projects { get; set; }
}

}