using backend.Domain.Entities.Transport;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Domain.Entities.Transport
{
    public class RouteStop
    {
        public int routeId { get; set; }

        public int stopId { get; set; }

        public RouteEntity route { get; set; }

        public Stop stop { get; set; }
    }
}
