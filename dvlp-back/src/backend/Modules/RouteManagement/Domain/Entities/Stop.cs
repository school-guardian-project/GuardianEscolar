using backend.Modules.BoardingManagement.Domain.Entities;
using backend.Modules.SchoolManagement.Domain.Entities;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Modules.RouteManagement.Domain.Entities
{
    public class Stop
    {
        public int Id { get; set; }

        public int cityId { get; set; }

        public int schoolId { get; set; }

        public string address { get; set; }

        public decimal longitude { get; set; }

        public decimal latitude { get; set; }

        public SchoolEntity school { get; set; }

        public City city { get; set; }

        public ICollection<Boarding> boardings { get; set; } = new List<Boarding>();

        public ICollection<RouteStop> routeStops { get; set; } = new List<RouteStop>();
    }
}
