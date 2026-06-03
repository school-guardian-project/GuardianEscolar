using backend.Modules.SchoolManagement.Domain.Entities;
using Medo;

namespace backend.Modules.RouteManagement.Domain.Entities
{
    public class RouteEntity
    {
        public Uuid7 Id { get; set; } = Uuid7.NewUuid7();

        public Uuid7 schoolId { get; set; }

        public string? Name { get; set; }

        public string? TargetSector { get; set; }

        public TimeSpan StartTime { get; set; }

        public TimeSpan EndTime { get; set; }

        public SchoolEntity school { get; set; }

        public ICollection<RouteBusAssignments> busAssignments { get; set; } = new List<RouteBusAssignments>();

        public ICollection<RouteStudentAssignments> studentAssignments { get; set; } = new List<RouteStudentAssignments>();

        public ICollection<RouteStop> routeStops { get; set; } = new List<RouteStop>();

        public ICollection<ExceptionalRouteUsage> exceptionalRouteUsages { get; set; } = new List<ExceptionalRouteUsage>();
    }
}
