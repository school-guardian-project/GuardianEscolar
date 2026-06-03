using backend.Modules.FleetManagement.Domain.Entities;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Modules.RouteManagement.Domain.Entities
{
    public class RouteBusAssignments
    {
        public int busId { get; set; }

        public int routeId { get; set; }

        public Bus bus { get; set; }

        public RouteEntity route { get; set; }
    }
}
