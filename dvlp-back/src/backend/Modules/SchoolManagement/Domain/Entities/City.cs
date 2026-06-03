using backend.Modules.RouteManagement.Domain.Entities;
using Medo;

namespace backend.Modules.SchoolManagement.Domain.Entities
{
    public class City
    {
        public Uuid7 cityId { get; set; } = Uuid7.NewUuid7();

        public string? name { get; set; }

        public string? country { get; set; }

        public ICollection<SchoolEntity> schools { get; set; }

        public ICollection<Stop> stops { get; set; } 
    }
}
