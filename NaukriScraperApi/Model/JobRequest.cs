using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace NaukriScraperApi.Model
{
    public class JobRequest
    {

    public int userId {get; set;}
    public string ?JobRole { get; set; }
    public string ?Experience { get; set; }
    public string ?Location { get; set; }
    public int ?noOfJobs {get; set;} = 0;
    }
}