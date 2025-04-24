using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace NaukriScraperApi.Model
{
    public class JobDetails
    {
        [Key]
        public int Id { get; set; }
        public string? jobId { get; set; }
        public string? jobTitle { get; set; }
        public string? companyName { get; set; }
        public string? experienceRequired { get; set; }
        public string? location { get; set; }
        public string? link { get; set; }
        public string? jobDescription { get; set; }
        public double? MatchScore { get; set; }
        public string? isApplied { get; set; }

        // Foreign key for User
        public int UserId { get; set; }

        // Navigation property
        public User? User { get; set; }
    }
}