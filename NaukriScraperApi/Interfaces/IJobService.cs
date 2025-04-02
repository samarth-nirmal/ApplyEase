using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using NaukriScraperApi.Model;

namespace NaukriScraperApi.Interfaces
{
    public interface IJobService
    {
        List<JobDetails> GetPendingJobs(int userId, bool onlyRelevant);
        void UpdateJobStatus(string jobId, int userId, string status);
    }
}