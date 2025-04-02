using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using NaukriScraperApi.Model;

namespace NaukriScraperApi.Interfaces
{
    public interface IJwtService
    {
        string GenerateToken(User user);
    }
}