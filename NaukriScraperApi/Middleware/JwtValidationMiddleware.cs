using System.Text;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.IdentityModel.Tokens;
using System.Security.Cryptography;
using Microsoft.EntityFrameworkCore; // For FirstOrDefaultAsync


public class JwtValidationMiddleware
{
    private readonly RequestDelegate _next;

    public JwtValidationMiddleware(RequestDelegate next)
    {
        _next = next;
    }

    public async Task Invoke(HttpContext context, AppDbContext db)
    {
        var token = context.Request.Headers["Authorization"].FirstOrDefault()?.Split(" ").Last();

        if (!string.IsNullOrEmpty(token))
        {
            var tokenHandler = new JwtSecurityTokenHandler();

            try
            {
                var jwtToken = tokenHandler.ReadJwtToken(token);
                var jti = jwtToken?.Claims.FirstOrDefault(c => c.Type == JwtRegisteredClaimNames.Jti)?.Value;
                var userId = int.Parse(jwtToken?.Claims.FirstOrDefault(c => c.Type == JwtRegisteredClaimNames.Sub)?.Value ?? "0");

                var jtiHash = Convert.ToBase64String(SHA256.HashData(Encoding.UTF8.GetBytes(jti)));

                var session = await db.TokenSessions.FirstOrDefaultAsync(s => s.JtiHash == jtiHash && s.UserId == userId);

                if (session == null || session.IsRevoked || session.ExpiresAt < DateTime.UtcNow)
                {
                    context.Response.StatusCode = 401;
                    await context.Response.WriteAsync("Token invalid or revoked");
                    return;
                }
            }
            catch
            {
                context.Response.StatusCode = 401;
                await context.Response.WriteAsync("Token tampered");
                return;
            }
        }

        await _next(context);
    }
}
