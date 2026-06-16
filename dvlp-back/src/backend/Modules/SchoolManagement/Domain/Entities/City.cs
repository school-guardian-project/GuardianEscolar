using backend.Modules.RouteManagement.Domain.Entities;
using backend.Shared.Abstracts;

namespace backend.Modules.SchoolManagement.Domain.Entities
{
    public class City : BaseEntity
    {
        public string? name { get; set; }

        public string? country { get; set; }

        public ICollection<SchoolEntity> schools { get; set; }

        public ICollection<Stop> stops { get; set; } 
    }
}
