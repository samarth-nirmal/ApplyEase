using Microsoft.EntityFrameworkCore;
using NaukriScraperApi.Model;
using System.Security.Cryptography;


public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<User> User { get; set; }
    public DbSet<JobDetails> JobDetails { get; set; }
    public DbSet<UserProfile> UserProfile { get; set; }
    public DbSet<UserResume> UserResumes { get; set; }
    public DbSet<Job> Jobs { get; set; }
    public DbSet<Education> Educations { get; set; }
    public DbSet<Project> Projects { get; set; }
    public DbSet<TokenSession> TokenSessions { get; set; }


    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<User>()
            .HasOne(u => u.UserProfile)
            .WithOne(up => up.User)
            .HasForeignKey<UserProfile>(up => up.UserId)
            .IsRequired(false);

        modelBuilder.Entity<User>()
            .HasMany(u => u.JobApplications)
            .WithOne(jd => jd.User)
            .HasForeignKey(jd => jd.UserId);

        modelBuilder.Entity<UserResume>()
            .HasMany(u => u.Jobs)
            .WithOne(j => j.UserResume)
            .HasForeignKey(j => j.UserResumeId);

        modelBuilder.Entity<UserResume>()
            .HasMany(u => u.Education)
            .WithOne(e => e.UserResume)
            .HasForeignKey(e => e.UserResumeId);

        modelBuilder.Entity<UserResume>()
            .HasMany(u => u.Projects)
            .WithOne(p => p.UserResume)
            .HasForeignKey(p => p.UserResumeId);

        base.OnModelCreating(modelBuilder);
    }

}