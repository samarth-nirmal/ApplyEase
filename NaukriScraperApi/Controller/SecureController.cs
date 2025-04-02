using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

[Authorize]
[ApiController]
[Route("api/secure")]
public class SecureController : ControllerBase
{
    [HttpGet]
    public IActionResult GetSecureData()
    {
        return Ok(new { message = "This is a secure endpoint!" });
    }
}
// Compare this snippet from NaukriScraperApi/Startup.cs:
//1079721870613-8s9r3idpedu0gdgl5umfaa0rhf4bimqg.apps.googleusercontent.com - Client ID
//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 - Client secret




//         var prompt = $@"
// You are an AI expert in parsing resumes and extracting structured data. Your goal is to extract key information accurately even if the resume does not have explicit headings or a standard format. The extracted information should be structured as follows:

// - Full Name: Identify the candidate's full name from the top of the resume or within contact details.  
// - Email: Find the most relevant email address.  
// - Phone Number: Identify the most likely phone number.  
// - Total Experience: Calculate total years of experience from work history, using job start and end dates.  
// - Current Job Title: Identify the latest job title from the most recent job in the experience section.  
// - Current Company: Find the current employer if actively employed, or the most recent employer.  
// - Industry: Infer the industry based on job roles, skills, and company type.  
// - Primary Skills: Identify core technical or professional skills from experience, skills sections, or inferred from responsibilities.  
// - Secondary Skills: Additional supporting skills relevant to the job.  
// - Certifications: Extract any listed certifications such as PMP, AWS Certified, or Microsoft Certified.  
// - Highest Qualification: Identify the highest education degree such as Bachelor's, Master's, or PhD.  
// - Specialization: Extract the specific field of study such as Computer Science, Marketing, or Finance.  
// - Graduation Year: Identify the year of graduation from education details.  
// - Preferred Job Role: If mentioned, extract the desired job role such as Software Engineer, Data Scientist, or Product Manager.  

// Ensure that:  
// - Even if explicit headings are missing, infer details from context.  
// - Avoid including unrelated text such as hobbies or personal interests.  
// - If any information is missing, return 'Not Mentioned' instead of 'N/A'.  

// Now, extract the details from the following resume:  

// {resumeText}
// ";


// using Microsoft.AspNetCore.Http;
// using Microsoft.AspNetCore.Mvc;
// using System.IO;
// using System.Text;
// using System.Threading.Tasks;
// using UglyToad.PdfPig;
// using DocumentFormat.OpenXml.Packaging;
// using NaukriScraperApi.Model;

// [Route("api/resume")]
// [ApiController]
// public class ResumeController : ControllerBase
// {
//     private readonly GeminiService _geminiService;

//     public ResumeController(GeminiService geminiService)
//     {
//         _geminiService = geminiService;
//     }

//     [HttpPost("upload")]
//     [Consumes("multipart/form-data")]
//     public async Task<IActionResult> UploadResume([FromForm] ResumeUploadDto request)
//     {
//         if (request.File == null || request.File.Length == 0)
//             return BadRequest("No file uploaded.");

//         string resumeText = await ExtractTextFromResume(request.File);
//         if (string.IsNullOrEmpty(resumeText))
//             return BadRequest("Could not extract text from resume.");

//         var parsedData = await _geminiService.ExtractResumeData(resumeText);
//         return Ok(parsedData);
//     }

//     private async Task<string> ExtractTextFromResume(IFormFile file)
//     {
//         string fileType = Path.GetExtension(file.FileName).ToLower();

//         // Copy file content to a MemoryStream
//         using var stream = new MemoryStream();
//         await file.CopyToAsync(stream);

//         stream.Seek(0, SeekOrigin.Begin); // ✅ Reset stream position before reading

//         if (fileType == ".pdf")
//         {
//             return ExtractTextFromPdf(stream);
//         }
//         else if (fileType == ".docx")
//         {
//             return ExtractTextFromDocx(stream);
//         }

//         return "Unsupported file format.";
//     }

//     private string ExtractTextFromPdf(Stream stream)
//     {
//         StringBuilder extractedText = new StringBuilder();

//         try
//         {
//             stream.Seek(0, SeekOrigin.Begin);
//             using (PdfDocument pdfDocument = PdfDocument.Open(stream))
//             {
//                 foreach (var page in pdfDocument.GetPages())
//                 {

//                     string rawText = page.Text;


//                     string formattedText = FixSpacing(rawText);

//                     extractedText.AppendLine(formattedText);
//                 }
//             }
//         }
//         catch (Exception ex)
//         {
//             return $"Error extracting text from PDF: {ex.Message}";
//         }

//         return extractedText.ToString();
//     }

//   private string FixSpacing(string text)
// {
//     // ✅ Ensure spaces after punctuation marks (fixes "Mumbai,Maharashtra" → "Mumbai, Maharashtra")
//     text = System.Text.RegularExpressions.Regex.Replace(text, @"([.,;:])([^\s])", "$1 $2");

//     // ✅ Fix missing spaces between lowercase-uppercase words (fixes "BachelorofTechnology" → "Bachelor of Technology")
//     text = System.Text.RegularExpressions.Regex.Replace(text, @"([a-z])([A-Z])", "$1 $2");

//     // ✅ Fix missing spaces between ALL CAPS words (fixes "SAMARTHNIRMAL" → "SAMARTH NIRMAL")
//     text = System.Text.RegularExpressions.Regex.Replace(text, @"([A-Z]{2,})([A-Z][a-z])", "$1 $2");

//     // ✅ Fix missing spaces between words and numbers (fixes "Dec2023" → "Dec 2023")
//     text = System.Text.RegularExpressions.Regex.Replace(text, @"([a-zA-Z])(\d)", "$1 $2");
//     text = System.Text.RegularExpressions.Regex.Replace(text, @"(\d)([a-zA-Z])", "$1 $2");

//     // ✅ Normalize multiple spaces to a single space
//     text = System.Text.RegularExpressions.Regex.Replace(text, @"\s+", " ").Trim();

//     return text;
// }



//     private string ExtractTextFromDocx(Stream stream)
//     {
//         StringBuilder extractedText = new StringBuilder();

//         try
//         {
//             stream.Seek(0, SeekOrigin.Begin); // ✅ Ensure stream is at the start before reading
//             using (WordprocessingDocument doc = WordprocessingDocument.Open(stream, false))
//             {
//                 var body = doc.MainDocumentPart?.Document.Body;
//                 if (body != null)
//                 {
//                     extractedText.AppendLine(body.InnerText);
//                 }
//             }
//         }
//         catch
//         {
//             return "Error extracting text from DOCX.";
//         }

//         return extractedText.ToString();
//     }
// }



























// using Microsoft.AspNetCore.Http;
// using Microsoft.AspNetCore.Mvc;
// using System.Diagnostics;
// using System.IO;
// using System.Text.Json;
// using System.Threading.Tasks;

// [ApiController]
// [Route("resume")]
// public class ResumeController : ControllerBase
// {
//     private readonly string _resumeStoragePath = @"C:\Users\10731110\OneDrive - LTIMindtree\Desktop\Practice\Naukri Scraper\NaukriScraperApi\Resumes\";
//     private readonly string _pythonScriptPath = @"C:\Users\10731110\OneDrive - LTIMindtree\Desktop\Practice\Naukri Scraper\NaukriScraperApi\Scripts\resume_parser.py";

    
//     [HttpPost("upload")]
//     public async Task<IActionResult> UploadResume(IFormFile file)
//     {
//         if (file == null || file.Length == 0)
//             return BadRequest("Invalid file.");

//         string fileExtension = Path.GetExtension(file.FileName);
//         string randomFileName = Guid.NewGuid().ToString() + fileExtension;
//         string filePath = Path.Combine(_resumeStoragePath, randomFileName);

//         Directory.CreateDirectory(_resumeStoragePath);
//         using (var stream = new FileStream(filePath, FileMode.Create))
//         {
//             await file.CopyToAsync(stream);
//         }

//         string jsonResponse = RunPythonScript(filePath);
    
//         try
//         {
//             var jsonData = JsonSerializer.Deserialize<object>(jsonResponse);
//             return Ok(new { message = "Resume processed successfully", extractedData = jsonData });
//         }
//         catch (JsonException)
//         {
//             return BadRequest("Invalid");
//         }
//     }

//     private string RunPythonScript(string filePath)
//     {
//         ProcessStartInfo psi = new ProcessStartInfo
//         {
//             FileName = "python",
//             Arguments = $"\"{_pythonScriptPath}\" \"{filePath}\"",
//             RedirectStandardOutput = true,
//             RedirectStandardError = true,
//             UseShellExecute = false,
//             CreateNoWindow = true
//         };

//         using (Process process = new Process { StartInfo = psi })
//         {
//             process.Start();
//             string output = process.StandardOutput.ReadToEnd();
//             string error = process.StandardError.ReadToEnd();
//             process.WaitForExit();
            
//             if (!string.IsNullOrEmpty(error))
//                 return $"{{\"error\": \"{error}\"}}";

//             return output;
//         }
//     }
// }
