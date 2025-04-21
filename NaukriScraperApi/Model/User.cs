using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace NaukriScraperApi.Model
{
    public class User
    {
        [Key]
        public int Id { get; set; }

        public string? GoogleId { get; set; } = string.Empty;

        [Required]
        public string Email { get; set; } = string.Empty;

        public string? PasswordHash { get; set; }

        public string Name { get; set; } = string.Empty;
        public string Picture { get; set; } = string.Empty;
        public string Role { get; set; } = string.Empty;
        public bool isNaukriLoggedIn { get; set; }

        // One User can have many JobDetails (One-to-Many)
        public List<JobDetails>? JobApplications { get; set; }

        // One User has one UserProfile (One-to-One)
        public UserProfile? UserProfile { get; set; }
    }
}