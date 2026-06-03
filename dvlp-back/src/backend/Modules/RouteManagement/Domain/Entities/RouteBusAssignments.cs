using backend.Modules.FleetManagement.Domain.Entities;
using Medo;

namespace backend.Modules.RouteManagement.Domain.Entities
{
    public class RouteBusAssignments
    {
        public Uuid7 Id { get; set; } = Uuid7.NewUuid7();

        public Uuid7 busId { get; set; }

        public Uuid7 routeId { get; set; }

        public Bus bus { get; set; }

        public RouteEntity route { get; set; }
    }
}
