namespace backend.Modules.RouteManagement.Domain.Entities
{
    public class RouteStop
    {
        public Guid routeStopId { get; set; } = Guid.NewGuid();

        public Guid routeId { get; set; }

        public Guid stopId { get; set; }

        public RouteEntity route { get; set; }

        public Stop stop { get; set; }
    }
}
