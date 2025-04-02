using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Diagnostics;
using System.IO;
using System.Text.Json;
using System.Threading.Tasks;

[ApiController]
[Route("resume")]
public class ResumeController : ControllerBase
{
    private readonly string _resumeStoragePath = @"C:\Users\10731110\OneDrive - LTIMindtree\Desktop\Practice\Naukri Scraper\NaukriScraperApi\Resumes\";
    private readonly string _pythonScriptPath = @"C:\Users\10731110\OneDrive - LTIMindtree\Desktop\Practice\Naukri Scraper\NaukriScraperApi\Scripts\resume_parser.py";

    
    [HttpPost("upload")]
    public async Task<IActionResult> UploadResume(IFormFile file)
    {
        if (file == null || file.Length == 0)
            return BadRequest("Invalid file.");

        string fileExtension = Path.GetExtension(file.FileName);
        string randomFileName = Guid.NewGuid().ToString() + fileExtension;
        string filePath = Path.Combine(_resumeStoragePath, randomFileName);

        Directory.CreateDirectory(_resumeStoragePath);
        using (var stream = new FileStream(filePath, FileMode.Create))
        {
            await file.CopyToAsync(stream);
        }

        string jsonResponse = RunPythonScript(filePath);
    
        try
        {
            var jsonData = JsonSerializer.Deserialize<object>(jsonResponse);
            return Ok(new { message = "Resume processed successfully", extractedData = jsonData });
        }
        catch (JsonException)
        {
            return BadRequest("Invalid");
        }
    }

    private string RunPythonScript(string filePath)
    {
        ProcessStartInfo psi = new ProcessStartInfo
        {
            FileName = "python",
            Arguments = $"\"{_pythonScriptPath}\" \"{filePath}\"",
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
                return $"{{\"error\": \"{error}\"}}";

            return output;
        }
    }
}
