using backend.Domain.Entities.Users;
using backend.Domain.Entities.Transport;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Domain.Entities.Exceptions
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
