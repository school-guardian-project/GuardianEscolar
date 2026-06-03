using backend.Modules.Security.Domain.Entities;

namespace backend.Modules.RouteManagement.Domain.Entities
{
    public class RouteStudentAssignments
    {
        public int profileId { get; set; }

        public int routeId { get; set; }

        public Profile profile { get; set; }

        public RouteEntity route { get; set; }
    }
}
