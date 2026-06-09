using backend.Modules.Security.Domain.Entities;
using backend.Shared.Abstracts;

namespace backend.Modules.RouteManagement.Domain.Entities
{
    public class RouteStudentAssignments : BaseEntity
    {
        public Guid profileId { get; set; }

        public Guid routeId { get; set; }

        public Profile profile { get; set; }

        public RouteEntity route { get; set; }
    }
}
