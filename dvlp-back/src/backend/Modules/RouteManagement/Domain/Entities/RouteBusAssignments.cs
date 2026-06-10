using backend.Modules.FleetManagement.Domain.Entities;
using backend.Shared.Abstracts;

namespace backend.Modules.RouteManagement.Domain.Entities
{
    public class RouteBusAssignments : BaseEntity
    {
        public Guid busId { get; set; }

        public Guid routeId { get; set; }

        public Bus bus { get; set; }

        public RouteEntity route { get; set; }
    }
}
