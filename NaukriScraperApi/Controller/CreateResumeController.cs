using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using NaukriScraperApi.Interfaces;
using NaukriScraperApi.Model;

namespace NaukriScraperApi.Controller
{
    [Route("[controller]")]
    public class CreateResumeController : ControllerBase
    {
        private readonly ILogger<CreateResumeController> _logger;
        private readonly IUserResumeService _userResumeService;

        public CreateResumeController(ILogger<CreateResumeController> logger, IUserResumeService userResumeService)
        {
            _logger = logger;
            _userResumeService = userResumeService;
        }
        [HttpPost]
        public async Task<IActionResult> CreateResume([FromBody] UserResume resume)
        {
            if (resume == null)
            {
                _logger.LogError("Resume data is null.");
                return BadRequest("Resume data cannot be null.");
            }

            var createdResume = await _userResumeService.CreateUserResumeAsync(resume);

            if (createdResume == null)
            {
                _logger.LogError("Failed to create resume.");
                return StatusCode(500, "Internal server error while creating resume.");
            }

            // Map to DTO to avoid large HTML strings and circular references
            var resultDto = new
            {
                createdResume.Id,
                createdResume.UserId,
                createdResume.FirstName,
                createdResume.LastName,
                createdResume.City,
                createdResume.Country,
                createdResume.Pincode,
                createdResume.PhoneNumber,
                createdResume.Email,
                createdResume.resumeTemplateId,
                Jobs = createdResume.Jobs?.Select(j => new { j.Id, j.JobTitle, j.CompanyName }),
                Education = createdResume.Education?.Select(e => new { e.Id, e.SchoolName, e.Qualification }),
                Projects = createdResume.Projects?.Select(p => new { p.Id, p.ProjectName })
            };

            return Ok(resultDto);
        }



        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var resume = await _userResumeService.GetUserResumeByIdAsync(id);
            if (resume == null)
                return NotFound();

            return Ok(resume);
        }

    }
}