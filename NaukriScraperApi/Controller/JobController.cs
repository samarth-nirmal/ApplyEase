using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NaukriScraperApi.Model;
using System.Diagnostics;
using System.Text.Json;
using System.Text.Json.Serialization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.AspNetCore.Authorization;


[ApiController]
[Route("api")]
public class JobController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly JobService _jobRepo;
    private readonly GeminiService _geminiService;
    private readonly ILogger<JobController> _logger;

    public JobController(AppDbContext context, JobService jobRepo, ILogger<JobController> logger, GeminiService geminiService)
    {
        _context = context;
        _jobRepo = jobRepo;
        _logger = logger;
        _geminiService = geminiService;
    }
    [Authorize]
    [Route("login/{userId}")]
    [HttpGet]
    public async Task<IActionResult> naukriLogin(int userId)
    {
        try
        {
            string scriptPath = @"C:\Users\10731110\OneDrive - LTIMindtree\Desktop\Practice\Naukri Scraper\NaukriScraperApi\Scripts\naukri_login.py";

            ProcessStartInfo psi = new ProcessStartInfo
            {
                FileName = "python",
                Arguments = $"\"{scriptPath}\" \"{userId}\"",
                RedirectStandardOutput = true,
                RedirectStandardError = true,
                UseShellExecute = false,
                CreateNoWindow = true
            };

            using (Process process = new Process { StartInfo = psi })
            {
                process.Start();
                string output = process.StandardOutput.ReadToEnd();
                string error = process.StandardError.ReadToEnd();
                process.WaitForExit();

                // if (!string.IsNullOrEmpty(error))
                //     return BadRequest(new { success = false, error });

                var pythonResponse = JsonSerializer.Deserialize<Dictionary<string, string>>(output);


                var user = await _context.User.FindAsync(userId);
                if (user != null)
                {
                    user.isNaukriLoggedIn = true;
                    await _context.SaveChangesAsync();
                }

                return Ok(pythonResponse);
            }
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { success = false, error = ex.Message });
        }
    }
    [Authorize]
    [Route("getjobs")]
    [HttpPost]
    public async Task<IActionResult> GetJobsAsync([FromBody] JobRequest request, [FromServices] GeminiService geminiService)
    {
        try
        {
            string scriptPath = @"C:\Users\10731110\OneDrive - LTIMindtree\Desktop\Practice\Naukri Scraper\Naukri Scraper\NaukriScraperApi\Scripts\naukri-scraper.py";

            ProcessStartInfo psi = new ProcessStartInfo
            {
                FileName = "python",
                Arguments = $"\"{scriptPath}\" \"{request.userId}\" \"{request.JobRole}\" \"{request.Experience}\" \"{request.Location}\" \"{request.noOfJobs}\"",
                RedirectStandardOutput = true,
                RedirectStandardError = true,
                UseShellExecute = false,
                CreateNoWindow = true
            };

            using (Process process = new Process { StartInfo = psi })
            {
                process.Start();
                string output = process.StandardOutput.ReadToEnd();
                string error = process.StandardError.ReadToEnd();
                process.WaitForExit();

                if (!string.IsNullOrEmpty(error))
                    return BadRequest(error);

                var options = new JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true,
                    DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull
                };

                var jobs = JsonSerializer.Deserialize<List<JobDetails>>(output, options);

                if (jobs != null)
                {
                    foreach (var job in jobs)
                    {
                        job.UserId = request.userId;
                    }

                    var existingJobIds = await _context.JobDetails
                        .Where(j => j.UserId == request.userId)
                        .Select(j => j.jobId)
                        .ToListAsync();

                    var newJobs = jobs.Where(j => !existingJobIds.Contains(j.jobId)).ToList();

                    if (newJobs.Any())
                    {
                        var userProfile = await _context.UserProfile
                            .Where(u => u.UserId == request.userId)
                            .Select(u => u.UserProfileSummary)
                            .FirstOrDefaultAsync();

                        if (userProfile != null)
                        {
                            // Actually wait and apply the score to each job
                            foreach (var job in newJobs)
                            {
                                job.MatchScore = await geminiService.CalculateJobMatchScore(userProfile, job.jobDescription);
                            }
                        }

                        await _context.JobDetails.AddRangeAsync(newJobs);
                        await _context.SaveChangesAsync();
                    }
                }

                return Ok(jobs);
            }
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Error: {ex.Message}");
        }
    }

    [Authorize]
    [HttpGet("auto-apply")]
    public async Task<IActionResult> AutoApplyJobs([FromQuery] int userId, [FromQuery] bool onlyRelevant)
    {
        try
        {
            List<JobDetails> jobs = _jobRepo.GetPendingJobs(userId, onlyRelevant);
            var userProfileSummary = await _context.UserProfile
                .Where(up => up.UserId == userId)
                .Select(up => up.UserProfileSummary)
                .FirstOrDefaultAsync();

            if (jobs.Count == 0)
            {
                return NotFound("No jobs available for auto-apply.");
            }

            string jobLinks = string.Join("|", jobs.Select(j => $"{j.jobId},{j.link},{j.UserId}"));


            string pythonScriptPath = @"C:\Users\10731110\OneDrive - LTIMindtree\Desktop\Practice\Naukri Scraper\Naukri Scraper\NaukriScraperApi\Scripts\auto-apply.py";

            ProcessStartInfo start = new ProcessStartInfo
            {
                FileName = "python",
                Arguments = $"\"{pythonScriptPath}\" \"{userId}\" \"{jobLinks}\" \"{userProfileSummary}\"",
                RedirectStandardOutput = true,
                RedirectStandardError = true,
                UseShellExecute = false,
                CreateNoWindow = true
            };

            using (Process process = new Process { StartInfo = start })
            {
                process.Start();
                string output = process.StandardOutput.ReadToEnd();
                string error = process.StandardError.ReadToEnd();
                process.WaitForExit();

                _logger.LogInformation("Results: {Results}", output);
                if (!string.IsNullOrEmpty(error))
                {
                    return StatusCode(500, $"Python script error: {error}");
                }

                List<JobApplicationResult> results = System.Text.Json.JsonSerializer.Deserialize<List<JobApplicationResult>>(output);
                // Log the results if needed (replace with a proper logging mechanism)
                foreach (var job in results)
                {
                    Console.WriteLine(job);
                    _jobRepo.UpdateJobStatus(job.jobId, job.userId, job.status);
                }

                return Ok(results);
            }
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Internal Server Error: {ex.Message}");
        }
    }

    public class JobApplicationResult
    {
        public string jobId { get; set; }
        public int userId { get; set; }
        public string status { get; set; }
    }

    [Authorize]
    [HttpGet]
    [Route("get-job-list")]
    public async Task<IActionResult> getJobList(int userId)
    {
        try
        {
            var jobList = await _context.JobDetails
                .Where(j => j.UserId == userId)
                .ToListAsync();

            if (jobList == null || !jobList.Any())
            {
                return NotFound("No jobs found for the specified user.");
            }

            return Ok(jobList);
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"An error occurred: {ex.Message}");
        }
    }


    [Authorize]
    [HttpPost]
    [Route("create-user-profile")]
    public async Task<IActionResult> CreateUserProfile([FromBody] UserProfile userProfile)
    {
        try
        {
            if (userProfile == null)
                return BadRequest("Invalid user profile data.");

            var existingUser = await _context.UserProfile.FirstOrDefaultAsync(up => up.UserId == userProfile.UserId);
            if (existingUser != null)
                return Conflict("User profile already exists");

            string userSummary = await _geminiService.GenerateUserProfileSummary(userProfile);
            userProfile.UserProfileSummary = userSummary;

            await _context.UserProfile.AddAsync(userProfile);
            await _context.SaveChangesAsync();

            return Ok(userProfile);
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"An error occurred: {ex.Message}");
        }
    }

    
    [Authorize]
    [HttpGet]
    [Route("get-user-profile")]
    public async Task<IActionResult> getUserProfile(int userId)
    {
        var userProfile = await _context.UserProfile.FirstOrDefaultAsync(up => up.UserId == userId);

        if (userProfile == null)
        {
            return NotFound("User Not Found");
        }

        return Ok(userProfile);
    }

    [Authorize]
    [HttpGet("check-user-status/{userId}")]
    public async Task<IActionResult> CheckUserStatus(int userId)
    {
        var user = await _context.User.FirstOrDefaultAsync(u => u.Id == userId);
        if (user == null)
        {
            return NotFound("User not found.");
        }

        var userProfile = await _context.UserProfile.FirstOrDefaultAsync(up => up.UserId == userId);
        bool isProfileComplete = userProfile != null && userProfile.PrimarySkills != null && userProfile.PrimarySkills.Any();


        return Ok(new
        {
            IsNaukriLoggedIn = user.isNaukriLoggedIn,
            IsProfileComplete = isProfileComplete
        });
    }

}