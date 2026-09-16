using backend.Modules.SchoolManagement.Domain.Entities;
using backend.Shared.Abstracts;

namespace backend.Modules.RouteManagement.Domain.Entities
{
    public class RouteEntity : BaseEntity
    {
        public Guid schoolId { get; set; }

        public string name { get; set; }

        public string targetSector { get; set; }

        public DateTime starDatetTime { get; set; } = DateTime.UtcNow;

        public DateTime endDateTime { get; set; } = DateTime.UtcNow;

        public SchoolEntity school { get; set; }

        public ICollection<RouteBusAssignments> busAssignments { get; set; } = new List<RouteBusAssignments>();

        public ICollection<RouteStudentAssignments> studentAssignments { get; set; } = new List<RouteStudentAssignments>();

        public ICollection<RouteStop> routeStops { get; set; } = new List<RouteStop>();

        public ICollection<ExceptionalRouteUsage> exceptionalRouteUsages { get; set; } = new List<ExceptionalRouteUsage>();
    }
}
