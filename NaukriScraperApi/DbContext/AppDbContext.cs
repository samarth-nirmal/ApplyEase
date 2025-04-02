using Microsoft.EntityFrameworkCore;
using NaukriScraperApi.Model;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<User> User { get; set; }
    public DbSet<JobDetails> JobDetails { get; set; }
    public DbSet<UserProfile> UserProfile { get; set; }


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

            base.OnModelCreating(modelBuilder);
        }
    
}