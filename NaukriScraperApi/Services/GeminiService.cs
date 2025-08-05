using System;
using System.Net.Http;
using System.Text;
using System.Text.Json;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using NaukriScraperApi.Model;

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


            string cleanedJson = Regex.Replace(rawText, @"```json|```", "").Trim();


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


    public async Task<string> GenerateUserProfileSummary(UserProfile userProfile)
    {
        string apiUrl = $"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key={_apiKey}";

        var requestBody = new
        {
            contents = new[]
            {
                new { role = "user", parts = new[] { new { text = GenerateProfileSummaryPrompt(userProfile) } } }
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

            var parsedData = JsonDocument.Parse(responseContent);

            if (!parsedData.RootElement.TryGetProperty("candidates", out JsonElement candidates) || candidates.GetArrayLength() == 0)
            {
                _logger.LogError("Error: 'candidates' key missing or empty in Gemini API response.");
                throw new Exception("Response text not found in response.");
            }

            JsonElement contentElement = candidates[0].GetProperty("content");

            string rawText = contentElement.ValueKind == JsonValueKind.String
                ? contentElement.GetString()
                : contentElement.GetProperty("parts")[0].GetProperty("text").GetString();

            return rawText;
        }
        catch (Exception ex)
        {
            _logger.LogError($"Unexpected error: {ex.Message}");
            throw;
        }
    }

    public async Task<string> GenerateCoverLetter(string userProfileSummary, string jobDescription, string jobTitle, string companyName)
    {
        string apiUrl = $"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key={_apiKey}";

        var requestBody = new
        {
            contents = new[]
            {
                new { role = "user", parts = new[] { new { text = GenerateCoverLetterPrompt(userProfileSummary, jobDescription, jobTitle, companyName) } } }
            }
        };

        var requestContent = new StringContent(JsonSerializer.Serialize(requestBody), Encoding.UTF8, "application/json");

        try
        {
            _logger.LogInformation("Sending request to Gemini API for cover letter generation...");
            var response = await _httpClient.PostAsync(apiUrl, requestContent);

            if (!response.IsSuccessStatusCode)
            {
                string errorResponse = await response.Content.ReadAsStringAsync();
                _logger.LogError($"Gemini API error: {response.StatusCode} - {errorResponse}");
                throw new Exception($"Gemini API returned {response.StatusCode}. {errorResponse}");
            }

            var responseContent = await response.Content.ReadAsStringAsync();
            _logger.LogInformation("Received response from Gemini API.");

            var parsedData = JsonDocument.Parse(responseContent);

            if (!parsedData.RootElement.TryGetProperty("candidates", out JsonElement candidates) || candidates.GetArrayLength() == 0)
            {
                _logger.LogError("Error: 'candidates' key missing or empty in Gemini API response.");
                throw new Exception("Response text not found in response.");
            }

            JsonElement contentElement = candidates[0].GetProperty("content");

            string rawText = contentElement.ValueKind == JsonValueKind.String
                ? contentElement.GetString()
                : contentElement.GetProperty("parts")[0].GetProperty("text").GetString();

            return rawText;
        }
        catch (Exception ex)
        {
            _logger.LogError($"Unexpected error: {ex.Message}");
            throw;
        }
    }


    //--------------  PROMPTS ------------------//


    private string GenerateCoverLetterPrompt(string userProfileSummary, string jobDescription, string jobTitle, string companyName)
    {
        return $"Generate a professional and concise cover letter using the details below. " +
               $"The letter must:\n" +
               $"- Include the candidate's name, experience, skills, and accomplishments based on the user profile.\n" +
               $"- Align with the responsibilities and qualifications in the job description.\n" +
               $"- Start with a formal greeting; if the company name or hiring manager is missing, use 'Sir/Madam' or avoid naming.\n" +
               $"- Keep the language as Humane as possible also the grammer, keep as humane as possible.\n" +
               $"- Keep the letter short and simple (max 2 paragraphs) and smartly integrated some important keywords from the Job Description inside the letter.\n" +
               $"- End with a polite, confident closing.\n" +
               $"Do not include any explanations or placeholders. Only return the finalized cover letter in proper formatting.\n\n" +
               $"User Profile:\n{userProfileSummary}\n\n" +
               $"Job Description:\n{jobDescription}" +
               $"Job Title:\n{jobTitle}" +
               $"Company Name:\n{companyName}";
    }


    private string GenerateProfileSummaryPrompt(UserProfile userProfile)
    {
        return $"Generate a detailed summary based on the following user details. This summary will be utilised to match job description with the user profile to extract job score for the user. Also this summary will be utilised to answer user related questions on job apply site e.g - What is your notice period? What is your preffered Location?:\n\n" +
               $"The summary should be on point, dont add extra words, just plain user data" +
               $"Also include users name and other personal details too" +
               $"Also if no current location is mentioned, take preffered location as current location" +
                $"{JsonSerializer.Serialize(userProfile, new JsonSerializerOptions { WriteIndented = true })}";
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
