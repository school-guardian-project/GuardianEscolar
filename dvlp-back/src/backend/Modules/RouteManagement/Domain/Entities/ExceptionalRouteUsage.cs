using backend.Modules.Security.Domain.Entities;
using Medo;

namespace backend.Modules.RouteManagement.Domain.Entities
{
    public class ExceptionalRouteUsage
    {
        public Uuid7 exceptionalRouteUsageId { get; set; } = Uuid7.NewUuid7();

        public Uuid7 profileId { get; set; }

        public Uuid7 routeId { get; set; }

        public DateTime dateTime { get; set; }

        public string reason { get; set; }

        public Profile profile { get; set; }

        public RouteEntity route { get; set; }
    }
}
