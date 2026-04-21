using backend.Domain.Entities.Exceptions;
using backend.Domain.Entities.School;
using backend.Domain.Entities.Transport;

namespace backend.Domain.Entities.Transport
{
    public class RouteEntity
    {
        public int Id { get; set; }

        public int schoolId { get; set; }

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
