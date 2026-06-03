using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Modules.RouteManagement.Domain.Entities
{
    public class RouteStop
    {
        public int routeId { get; set; }

        public int stopId { get; set; }

        public RouteEntity route { get; set; }

        public Stop stop { get; set; }
    }
}
