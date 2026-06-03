using backend.Modules.Security.Domain.Entities;

namespace backend.Modules.RouteManagement.Domain.Entities
{
    public class ExceptionalRouteUsage
    {
        public Guid exceptionalRouteUsageId { get; set; } = Guid.NewGuid();

        public Guid profileId { get; set; }

        public Guid routeId { get; set; }

        public DateTime dateTime { get; set; }

        public string reason { get; set; }

        public Profile profile { get; set; }

        public RouteEntity route { get; set; }
    }
}
