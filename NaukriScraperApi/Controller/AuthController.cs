    using Google.Apis.Auth;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NaukriScraperApi.Model;
using BCrypt.Net;
using Microsoft.AspNetCore.Authorization;
using System.Text;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.IdentityModel.Tokens;
using System.Security.Cryptography;
using System.Linq;

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

    // [HttpPost("google-login")]
    // public async Task<IActionResult> GoogleLogin([FromBody] GoogleLoginRequest request)
    // {
    //     try
    //     {
    //         var settings = new GoogleJsonWebSignature.ValidationSettings
    //         {
    //             Audience = new[] { _config["GoogleAuth:ClientId"] }
    //         };

    //         var payload = await GoogleJsonWebSignature.ValidateAsync(request.Token, settings);

    //         // Check if user exists
    //         var user = await _db.User.FirstOrDefaultAsync(u => u.GoogleId == payload.Subject);
    //         if (user == null)
    //         {
    //             user = new User
    //             {
    //                 GoogleId = payload.Subject,
    //                 Email = payload.Email,
    //                 Name = payload.Name,
    //                 Picture = payload.Picture,
    //                 Role = "User"
    //             };
    //             _db.User.Add(user);
    //             await _db.SaveChangesAsync();
    //         }

    //         // Generate JWT Token
    //         var token = _jwtService.GenerateToken(user);

    //         return Ok(new
    //         {
    //             user.Id,
    //             user.Name,
    //             user.Email,
    //             user.Picture,
    //             user.Role,
    //             Token = token
    //         });
    //     }
    //     catch (InvalidJwtException)
    //     {
    //         return BadRequest("Invalid Google token");
    //     }
    //     catch (Exception ex)
    //     {
    //         return StatusCode(500, "Internal server error: " + ex.Message);
    //     }
    // }

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

            var (token, jti, expiresAt) = _jwtService.GenerateToken(user);
            var jtiHash = Convert.ToBase64String(SHA256.HashData(Encoding.UTF8.GetBytes(jti)));

            var tokenSession = new TokenSession
            {
                UserId = user.Id,
                JtiHash = jtiHash,
                IssuedAt = DateTime.UtcNow,
                ExpiresAt = expiresAt,
                IsRevoked = false,
                // IpAddress = HttpContext.Connection.RemoteIpAddress?.ToString(),
                // UserAgent = Request.Headers["User-Agent"]
            };

            _db.TokenSessions.Add(tokenSession);
            await _db.SaveChangesAsync();

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
            return Unauthorized("Invalid Google token");
        }
        catch (Exception ex)
        {
            return StatusCode(500, "Internal server error: " + ex.Message);
        }
    }


    // [HttpPost("login")]
    // public async Task<IActionResult> Login([FromBody] LoginRequest request)
    // {
    //     var user = await _db.User.FirstOrDefaultAsync(u => u.Email == request.Email);

    //     if (user == null || user.PasswordHash == null || !BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
    //         return Unauthorized("Invalid email or password");

    //     var token = _jwtService.GenerateToken(user);
    //     return Ok(new
    //     {
    //         user.Id,
    //         user.Name,
    //         user.Email,
    //         user.Picture,
    //         user.Role,
    //         Token = token
    //     });
    // }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequest request)
    {
        var user = await _db.User.FirstOrDefaultAsync(u => u.Email == request.Email);

        if (user == null || user.PasswordHash == null || !BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
            return BadRequest("Invalid email or password");



        var (token, jti, expiresAt) = _jwtService.GenerateToken(user);
        var jtiHash = Convert.ToBase64String(SHA256.HashData(Encoding.UTF8.GetBytes(jti)));

        var tokenSession = new TokenSession
        {
            UserId = user.Id,
            JtiHash = jtiHash,
            IssuedAt = DateTime.UtcNow,
            ExpiresAt = expiresAt,
            IsRevoked = false,
            // IpAddress = HttpContext.Connection.RemoteIpAddress?.ToString(),
            // UserAgent = Request.Headers["User-Agent"]
        };

        _db.TokenSessions.Add(tokenSession);
        await _db.SaveChangesAsync();

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


    [HttpPost("logout")]
    public async Task<IActionResult> Logout()
    {
        var authHeader = Request.Headers["Authorization"].ToString();
        if (string.IsNullOrEmpty(authHeader) || !authHeader.StartsWith("Bearer "))
            return BadRequest("Invalid token");

        var token = authHeader.Substring("Bearer ".Length).Trim();

        var handler = new JwtSecurityTokenHandler();
        JwtSecurityToken jwt;

        try
        {
            jwt = handler.ReadJwtToken(token);
        }
        catch
        {
            return BadRequest("Invalid JWT format");
        }

        var jti = jwt.Claims.FirstOrDefault(c => c.Type == JwtRegisteredClaimNames.Jti)?.Value;

        if (jti == null) return BadRequest("Missing JTI");

        // Hash the jti before comparing
        using var sha = SHA256.Create();
        var jtiHash = Convert.ToBase64String(sha.ComputeHash(Encoding.UTF8.GetBytes(jti)));

        var session = await _db.TokenSessions.FirstOrDefaultAsync(s => s.JtiHash == jtiHash);
        if (session != null)
        {
            session.IsRevoked = true;
            await _db.SaveChangesAsync();
        }

        return Ok();
    }

    [Authorize]
    [HttpGet("validate-token")]
    public IActionResult ValidateToken()
    {
        // If the token is valid, this method will be reached
        return Ok(new { valid = true });
    }




    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterRequest request)
    {
        if (await _db.User.AnyAsync(u => u.Email == request.Email))
            return BadRequest("Email already exists");

        var user = new User
        {
            Email = request.Email,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password),
            Name = request.Name,
            Role = "User"
        };

        _db.User.Add(user);
        await _db.SaveChangesAsync();

        return Ok(200);
    }


}
