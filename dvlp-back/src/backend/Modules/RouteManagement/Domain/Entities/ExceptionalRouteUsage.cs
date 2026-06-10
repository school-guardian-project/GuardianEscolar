using backend.Modules.Security.Domain.Entities;
using backend.Shared.Abstracts;

namespace backend.Modules.RouteManagement.Domain.Entities
{
    public class ExceptionalRouteUsage : BaseEntity
    {
        public Guid profileId { get; set; }

        public Guid routeId { get; set; }

        public DateTime dateTime { get; set; }

        public string reason { get; set; }

        public Profile profile { get; set; }

        public RouteEntity route { get; set; }
    }
}
