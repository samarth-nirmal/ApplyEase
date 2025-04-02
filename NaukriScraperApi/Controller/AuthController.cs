using Google.Apis.Auth;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NaukriScraperApi.Model;

[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
    private readonly AppDbContext _db;
    private readonly JwtService _jwtService;
    private readonly IConfiguration _config;

    public AuthController(AppDbContext db, JwtService jwtService, IConfiguration config)
    {
        _db = db;
        _jwtService = jwtService;
        _config = config;
    }

    [HttpPost("google-login")]
    public async Task<IActionResult> GoogleLogin([FromBody] GoogleLoginRequest request)
    {
        try
        {
            var settings = new GoogleJsonWebSignature.ValidationSettings
            {
                Audience = new[] { _config["GoogleAuth:ClientId"] }
            };

            var payload = await GoogleJsonWebSignature.ValidateAsync(request.Token, settings);

            // Check if user exists
            var user = await _db.User.FirstOrDefaultAsync(u => u.GoogleId == payload.Subject);
            if (user == null)
            {
                user = new User
                {
                    GoogleId = payload.Subject,
                    Email = payload.Email,
                    Name = payload.Name,
                    Picture = payload.Picture,
                    Role = "User"
                };
                _db.User.Add(user);
                await _db.SaveChangesAsync();
            }

            // Generate JWT Token
            var token = _jwtService.GenerateToken(user);

            return Ok(new
            {
                user.Id,
                user.Name,
                user.Email,
                user.Picture,
                user.Role,
                Token = token
            });
        }
        catch (InvalidJwtException)
        {
            return BadRequest("Invalid Google token");
        }
        catch (Exception ex)
        {
            return StatusCode(500, "Internal server error: " + ex.Message);
        }
    }
}
