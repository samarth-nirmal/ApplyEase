using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace NaukriScraperApi.Model
{
    public class TokenSession
    {
    public int Id { get; set; }
    public int UserId { get; set; }
    public string JtiHash { get; set; }  // Store hashed JTI here
    public DateTime IssuedAt { get; set; }
    public DateTime ExpiresAt { get; set; }
    public bool IsRevoked { get; set; }
    public string? IpAddress { get; set; }
    public string? UserAgent { get; set; }
    }
}