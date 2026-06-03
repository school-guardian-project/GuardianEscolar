using backend.Modules.RouteManagement.Domain.Entities;

namespace backend.Modules.SchoolManagement.Domain.Entities
{
    public class City
    {
        public int Id { get; set; }

        public string? name { get; set; }

        public string? country { get; set; }

        public ICollection<SchoolEntity> schools { get; set; }

        public ICollection<Stop> stops { get; set; } 
    }
}
