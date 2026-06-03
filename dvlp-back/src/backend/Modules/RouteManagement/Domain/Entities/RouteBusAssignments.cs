using backend.Modules.FleetManagement.Domain.Entities;

namespace backend.Modules.RouteManagement.Domain.Entities
{
    public class RouteBusAssignments
    {
        public Guid routeBusAssignmentsId { get; set; } = Guid.NewGuid();

        public Guid busId { get; set; }

        public Guid routeId { get; set; }

        public Bus bus { get; set; }

        public RouteEntity route { get; set; }
    }
}
