
using System.Collections.Generic;
using System.Linq;
using NaukriScraperApi.Interfaces;
using NaukriScraperApi.Model;

public class JobService : IJobService
{
    private readonly AppDbContext _context;

    public JobService(AppDbContext context)
    {
        _context = context;
    }

    public List<JobDetails> GetPendingJobs(int userId, bool onlyRelevant)
    {
        var jobs = _context.JobDetails
            .Where(j => j.UserId == userId && j.isApplied != "Applied" && j.isApplied != "Apply on Company Portal")
            .ToList();

        if (onlyRelevant)
        {
            jobs = jobs.Where(j => j.MatchScore >= 80).ToList();
        }

        return jobs;
    }

    public void UpdateJobStatus(string jobId, int userId, string status)
    {
        var job = _context.JobDetails.FirstOrDefault(j => j.jobId == jobId && j.UserId == userId);
        if (job != null)
        {
            job.isApplied = status;
            _context.SaveChanges();
        }
    }
}
