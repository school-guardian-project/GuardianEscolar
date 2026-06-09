using backend.Modules.BoardingManagement.Domain.Entities;
using backend.Modules.SchoolManagement.Domain.Entities;
using backend.Shared.Abstracts;

namespace backend.Modules.RouteManagement.Domain.Entities
{
    public class Stop : BaseEntity
    {
        public Guid cityId { get; set; }

        public Guid schoolId { get; set; }

        public string address { get; set; }

        public decimal longitude { get; set; }

        public decimal latitude { get; set; }

        public SchoolEntity school { get; set; }

        public City city { get; set; }

        public ICollection<Boarding> boardings { get; set; } = new List<Boarding>();

        public ICollection<RouteStop> routeStops { get; set; } = new List<RouteStop>();
    }
}
