// using System;
// using System.Net.Http;
// using System.Text;
// using System.Text.Json;
// using System.Text.RegularExpressions;
// using System.Threading.Tasks;
// using Microsoft.Extensions.Configuration;
// using Microsoft.Extensions.Logging;

// public class GeminiService
// {
//     private readonly HttpClient _httpClient;
//     private readonly string _apiKey;
//     private readonly ILogger<GeminiService> _logger; // Add logger

//     public GeminiService(HttpClient httpClient, IConfiguration configuration, ILogger<GeminiService> logger)
//     {
//         _httpClient = httpClient ?? throw new ArgumentNullException(nameof(httpClient));
//         _apiKey = configuration["Gemini:ApiKey"] ?? throw new ArgumentNullException("Gemini:ApiKey", "API Key cannot be null");
//         _logger = logger ?? throw new ArgumentNullException(nameof(logger));
//     }

//     public async Task<string> ExtractResumeData(string resumeText)
//     {
//         string apiUrl = $"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key={_apiKey}";

//                 var requestBody = new
//         {
//             contents = new[]
//             {
//                 new { role = "user", parts = new[] { new { text = GeneratePrompt(resumeText) } } }
//             }
//         };

//         var requestContent = new StringContent(JsonSerializer.Serialize(requestBody), Encoding.UTF8, "application/json");

//         try
//         {
//             _logger.LogInformation("Sending request to Gemini API...");
//             var response = await _httpClient.PostAsync(apiUrl, requestContent);

//             if (!response.IsSuccessStatusCode)
//             {
//                 _logger.LogError($"Gemini API error: {response.StatusCode} - {await response.Content.ReadAsStringAsync()}");
//                 return "Failed to extract resume data. Check API response.";
//             }

//             var responseContent = await response.Content.ReadAsStringAsync();
//             _logger.LogInformation("Received response from Gemini API.");

//             return ExtractJsonFromResponse(responseContent);
//         }
//         catch (HttpRequestException ex)
//         {
//             _logger.LogError($"HTTP request error: {ex.Message}");
//             return "Failed to connect to Gemini API.";
//         }
//         catch (JsonException ex)
//         {
//             _logger.LogError($"JSON parsing error: {ex.Message}");
//             return "Invalid JSON response from Gemini API.";
//         }
//         catch (Exception ex)
//         {
//             _logger.LogError($"Unexpected error: {ex.Message}");
//             return "An unexpected error occurred.";
//         }
//     }

//     private string ExtractJsonFromResponse(string responseContent)
//     {
//         try
//         {
//             var parsedData = JsonDocument.Parse(responseContent);
//             JsonElement contentElement = parsedData.RootElement.GetProperty("candidates")[0].GetProperty("content");

//             string rawText;

//             // ✅ Check if "content" is a STRING
//             if (contentElement.ValueKind == JsonValueKind.String)
//             {
//                 rawText = contentElement.GetString();
//             }
//             // ✅ Check if "content" is an OBJECT and extract "parts"
//             else if (contentElement.ValueKind == JsonValueKind.Object && contentElement.TryGetProperty("parts", out JsonElement partsElement))
//             {
//                 rawText = partsElement[0].GetProperty("text").GetString();
//             }
//             else
//             {
//                 throw new JsonException("Unexpected response format from Gemini API.");
//             }

//             // ✅ Remove ```json ... ``` if present
//             string cleanedJson = Regex.Replace(rawText, @"```json|```", "").Trim();

//             // ✅ Pretty-print JSON
//             using var doc = JsonDocument.Parse(cleanedJson);
//             return JsonSerializer.Serialize(doc.RootElement, new JsonSerializerOptions { WriteIndented = true });
//         }
//         catch (JsonException ex)
//         {
//             _logger.LogError($"Error while extracting JSON: {ex.Message}");
//             return "Invalid response format.";
//         }
//     }





//     private string GeneratePrompt(string resumeText)
//     {
//         return $@"
//     You are an AI specialized in parsing resumes and extracting structured data. Your task is to accurately extract key information, even when the resume lacks explicit headings or a standard format.

//     Extract and return the data strictly in valid JSON format as follows, Just give the data in json, don't even write a extra word:
//     {{
//       'full_name': 'Candidate's Full Name',
//       'email': 'Candidate's Email Address',
//       'phone_number': 'Candidate's Phone Number',
//       'total_experience': 'Total Years of Experience (e.g., 5 years)' (Calculate this based on the work experience years eg. if working from dec 2023 to present means dec 2023 to mar 2025 is 1 year 3 months),
//       'current_job_title': 'Most Recent Job Title',
//       'current_company': 'Current or Most Recent Employer',
//       'industry': 'Industry Inferred from Experience',
//       'primary_skills': ['Skill1', 'Skill2', 'Skill3'],
//       'secondary_skills': ['SkillA', 'SkillB'],
//       'certifications': ['Certification1', 'Certification2'],
//       'highest_qualification': 'Highest Degree (e.g., Bachelor's, Master's, PhD)',
//       'specialization': 'Field of Study (e.g., Computer Science, Finance)',
//       'graduation_year': 'Year of Graduation (if available)',
//       'projects'': ''[Project Title 1 (Tech Used), Project Title 2 (Tech Used)] (if available)',
//       'preferred_job_role': 'Desired Job Role (if mentioned)'
//     }}

//     Guidelines:
//     - If explicit headings are missing, infer details from context.
//     - Ensure valid JSON syntax with correct data types (strings, arrays, etc.).
//     - Exclude unrelated text such as hobbies or personal interests.
//     - If any information is unavailable, return 'Not Mentioned' instead of leaving it blank.

//     Now, extract and return the details in JSON format from the following resume:
//     {resumeText}";
//     }
// }


using System;
using System.Net.Http;
using System.Text;
using System.Text.Json;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

public class GeminiService
{
    private readonly HttpClient _httpClient;
    private readonly string _apiKey;
    private readonly ILogger<GeminiService> _logger;

    public GeminiService(HttpClient httpClient, IConfiguration configuration, ILogger<GeminiService> logger)
    {
        _httpClient = httpClient ?? throw new ArgumentNullException(nameof(httpClient));
        _apiKey = configuration["Gemini:ApiKey"] ?? throw new ArgumentNullException("Gemini:ApiKey", "API Key cannot be null");
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
    }

    public async Task<double> CalculateJobMatchScore(string userProfile, string jobDescription)
    {
        string apiUrl = $"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key={_apiKey}";

        var requestBody = new
        {
            contents = new[]
            {
                new { role = "user", parts = new[] { new { text = GenerateJobMatchPrompt(userProfile, jobDescription) } } }
            }
        };

        var requestContent = new StringContent(JsonSerializer.Serialize(requestBody), Encoding.UTF8, "application/json");

        try
        {
            _logger.LogInformation("Sending request to Gemini API for job match scoring...");
            var response = await _httpClient.PostAsync(apiUrl, requestContent);

            if (!response.IsSuccessStatusCode)
            {
                string errorResponse = await response.Content.ReadAsStringAsync();
                _logger.LogError($"Gemini API error: {response.StatusCode} - {errorResponse}");
                throw new Exception($"Gemini API returned {response.StatusCode}. {errorResponse}");
            }

            var responseContent = await response.Content.ReadAsStringAsync();
            _logger.LogInformation("Received response from Gemini API.");

            return ExtractMatchScore(responseContent);
        }
        catch (HttpRequestException ex)
        {
            _logger.LogError($"HTTP request error: {ex.Message}");
            throw new Exception("Failed to connect to Gemini API.");
        }
        catch (JsonException ex)
        {
            _logger.LogError($"JSON parsing error: {ex.Message}");
            throw new Exception("Invalid JSON response from Gemini API.");
        }
        catch (Exception ex)
        {
            _logger.LogError($"Unexpected error: {ex.Message}");
            throw;
        }
    }

    private double ExtractMatchScore(string responseContent)
    {
        try
        {
            var parsedData = JsonDocument.Parse(responseContent);

            // 🔹 Log full response for debugging
            _logger.LogInformation("Full Gemini API Response: {Response}", responseContent);

            // 🔹 Check if "candidates" exists
            if (!parsedData.RootElement.TryGetProperty("candidates", out JsonElement candidates) || candidates.GetArrayLength() == 0)
            {
                _logger.LogError("Error: 'candidates' key missing or empty in Gemini API response.");
                throw new Exception("Match score not found in response.");
            }

            JsonElement contentElement = candidates[0].GetProperty("content");

            string rawText = contentElement.ValueKind == JsonValueKind.String
                ? contentElement.GetString()
                : contentElement.GetProperty("parts")[0].GetProperty("text").GetString();

            // 🔹 Clean response text (removing ```json ... ```)
            string cleanedJson = Regex.Replace(rawText, @"```json|```", "").Trim();

            // 🔹 Try parsing the match_score from JSON
            using var doc = JsonDocument.Parse(cleanedJson);
            if (doc.RootElement.TryGetProperty("match_score", out JsonElement matchScoreElement) && matchScoreElement.ValueKind == JsonValueKind.Number)
            {
                return matchScoreElement.GetDouble();
            }

            _logger.LogError("Error: 'match_score' key missing in parsed JSON.");
            throw new Exception("Match score not found in response.");
        }
        catch (JsonException ex)
        {
            _logger.LogError($"JSON parsing error: {ex.Message}");
            throw new Exception("Invalid JSON response from Gemini API.");
        }
        catch (Exception ex)
        {
            _logger.LogError($"Unexpected error: {ex.Message}");
            throw;
        }
    }

    private string GenerateJobMatchPrompt(string userProfile, string jobDescription)
    {
        return $@"
        You are an AI specializing in job matching. Compare the given **User Profile** and **Job Description**.
        Analyze how well the user's skills, experience, and qualifications align with the job.

        **User Profile:**
        {userProfile}

        **Job Description:**
        {jobDescription}

        Please return a match percentage **strictly in JSON format** as follows:
        We must **strip these markers** before parsing - ```json
        {{
            ""match_score"": 85.4  // A percentage between 0 and 100
        }}

        Guidelines:
        - Compare strictly, Like each n every keyword.
        - Base the score on **skills, experience, and education** relevance.
        - If the user profile strongly matches the job, return a **higher score**.
        - If there is **some relevance**, return a **moderate score**.
        - If the user profile does **not match at all**, return a **low score**.
        - Return only the JSON object without any extra text.";
    }
}
