using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using NaukriScraperApi.Interfaces;
using NaukriScraperApi.Model;

namespace NaukriScraperApi.Services
{
public class UserResumeService : IUserResumeService
{
    private readonly AppDbContext _context;

    public UserResumeService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<UserResume> CreateUserResumeAsync(UserResume resume)
    {
        // Ensure bidirectional relationships
        if (resume.Jobs != null)
        {
            foreach (var job in resume.Jobs)
                job.UserResume = resume;
        }

        if (resume.Education != null)
        {
            foreach (var edu in resume.Education)
                edu.UserResume = resume;
        }

        if (resume.Projects != null)
        {
            foreach (var proj in resume.Projects)
                proj.UserResume = resume;
        }

        _context.UserResumes.Add(resume);
        await _context.SaveChangesAsync();
        return resume;
    }

    public async Task<UserResume?> GetUserResumeByIdAsync(int id)
    {
        return await _context.UserResumes
            .Include(r => r.Jobs)
            .Include(r => r.Education)
            .Include(r => r.Projects)
            .FirstOrDefaultAsync(r => r.Id == id);
    }
}

}