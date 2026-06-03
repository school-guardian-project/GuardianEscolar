using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using backend.Modules.Security.Domain.Entities;

namespace backend.Modules.RouteManagement.Domain.Entities
{
    public class ExceptionalRouteUsage
    {
        public int Id { get; set; }

        public int profileId { get; set; }

        public int routeId { get; set; }

        public DateTime dateTime { get; set; }

        public string reason { get; set; }

        public Profile profile { get; set; }

        public RouteEntity route { get; set; }
    }
}
