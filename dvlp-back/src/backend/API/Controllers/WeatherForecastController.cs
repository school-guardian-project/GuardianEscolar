using Microsoft.AspNetCore.Mvc;

namespace backend.API.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class WeatherForecastController : ControllerBase
    {
        [HttpGet]
        public IActionResult Get()
        {
            var rng = new Random();
            var summaries = new[] { "Soleado", "Nublado", "Lluvia", "Tormenta", "Viento" };
            var result = Enumerable.Range(1, 5).Select(index => new
            {
                date = DateTime.Now.AddDays(index),
                temperaturaC = rng.Next(-10, 35),
                summary = summaries[rng.Next(summaries.Length)]
            }).ToArray();

            return Ok(result);
        }
    }
}
