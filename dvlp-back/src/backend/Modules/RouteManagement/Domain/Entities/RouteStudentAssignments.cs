using backend.Modules.Security.Domain.Entities;

namespace backend.Modules.RouteManagement.Domain.Entities
{
    public class RouteStudentAssignments
    {
        public Guid routeStudentAssignmentsId { get; set; } = Guid.NewGuid();

        public Guid profileId { get; set; }

        public Guid routeId { get; set; }

        public Profile profile { get; set; }

        public RouteEntity route { get; set; }
    }
}
