using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using NaukriScraperApi.Interfaces;
using NaukriScraperApi.Model;

public class JwtService : IJwtService
{
    private readonly IConfiguration _config;
    private readonly string _jwtKey;
    private readonly string _jwtIssuer;
    private readonly string _jwtAudience;
    private readonly int _jwtExpirationInMinutes;

    public JwtService(IConfiguration config)
    {
        _config = config;

        // Ensure these values are correctly retrieved from appsettings.json
        _jwtKey = _config["Jwt:Key"] ?? throw new ArgumentNullException("Jwt:Key is missing in appsettings.json");
        _jwtIssuer = _config["Jwt:Issuer"] ?? throw new ArgumentNullException("Jwt:Issuer is missing in appsettings.json");
        _jwtAudience = _config["Jwt:Audience"] ?? throw new ArgumentNullException("Jwt:Audience is missing in appsettings.json");
        _jwtExpirationInMinutes = int.TryParse(_config["Jwt:ExpirationMinutes"], out int expiration) ? expiration : 60;
    }

    public string GenerateToken(User user)
    {
        var claims = new[]
        {
            new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
            new Claim(JwtRegisteredClaimNames.Email, user.Email),
            new Claim("role", user.Role),
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
        };

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwtKey));
        var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
        
        var token = new JwtSecurityToken(
            issuer: _jwtIssuer,
            audience: _jwtAudience,
            claims: claims,
            expires: DateTime.UtcNow.AddMinutes(_jwtExpirationInMinutes), // Configurable Expiry Time
            signingCredentials: credentials
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }

    
}
