using backend.Modules.Security.Domain.Entities;
using Medo;

namespace backend.Modules.RouteManagement.Domain.Entities
{
    public class RouteStudentAssignments
    {
        public Uuid7 Id { get; set; } = Uuid7.NewUuid7();

        public Uuid7 profileId { get; set; }

        public Uuid7 routeId { get; set; }

        public Profile profile { get; set; }

        public RouteEntity route { get; set; }
    }
}
