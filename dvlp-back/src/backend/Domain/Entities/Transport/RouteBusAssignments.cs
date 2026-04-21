using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Domain.Entities.Transport
{
    public class RouteBusAssignments
    {
        public int busId { get; set; }

        public int routeId { get; set; }

        public Bus bus { get; set; }

        public RouteEntity route { get; set; }
    }
}
