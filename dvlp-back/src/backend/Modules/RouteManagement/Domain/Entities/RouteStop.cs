using Medo;

namespace backend.Modules.RouteManagement.Domain.Entities
{
    public class RouteStop
    {
        public Uuid7 routeStopId { get; set; } = Uuid7.NewUuid7();

        public Uuid7 routeId { get; set; }

        public Uuid7 stopId { get; set; }

        public RouteEntity route { get; set; }

        public Stop stop { get; set; }
    }
}
