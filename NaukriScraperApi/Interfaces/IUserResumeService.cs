using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using NaukriScraperApi.Model;

namespace NaukriScraperApi.Interfaces
{
    public interface IUserResumeService
    {
        Task<UserResume> CreateUserResumeAsync(UserResume resume);
        // Task<UserResume?> GetUserResumeByIdAsync(int id);
        Task<IEnumerable<object>> GetUserResumeListAsync(int id);
    }

}