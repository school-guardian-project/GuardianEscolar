using backend.Model.Entities.Users;

namespace backend.Model.Entities.Transport
{
    public class RouteStudentAssignments
    {
        public int profileId { get; set; }

        public int routeId { get; set; }

        public Profile profile { get; set; }

        public RouteEntity route { get; set; }
    }
}
