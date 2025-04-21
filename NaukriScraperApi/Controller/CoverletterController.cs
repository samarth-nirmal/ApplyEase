using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using NaukriScraperApi.Model;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;


    [Authorize]
    [ApiController]
    [Route("[controller]")]
    public class CoverletterController : Controller
    {
        private readonly ILogger<CoverletterController> _logger;
        private readonly AppDbContext _context;
        private readonly GeminiService _geminiService;

        public CoverletterController(ILogger<CoverletterController> logger, AppDbContext context, GeminiService geminiService)
        {
            _geminiService = geminiService;
            _logger = logger;
            _context = context;
        }

        [Authorize]
        [HttpPost]
        public async Task<IActionResult> GenerateCoverLetter([FromBody] CoverLetterRequest request)
        {
            if (request == null || string.IsNullOrEmpty(request.JobDescription))
            {
                return BadRequest("Invalid request data.");
            }

            var user = await _context.UserProfile.FirstOrDefaultAsync(u => u.UserId == request.UserId);
            if (user == null)
            {
                return NotFound("User not found.");
            }

            try
            {
                var coverLetter = await _geminiService.GenerateCoverLetter(user.UserProfileSummary, request.JobDescription);
                return Ok(coverLetter);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error generating cover letter.");
                return StatusCode(500, "Internal server error while generating cover letter.");
            }
        }
    }
