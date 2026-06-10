using backend.Modules.FleetManagement.Domain.Entities;
using backend.Modules.RouteManagement.Domain.Entities;
using backend.Modules.Security.Domain.Entities;
using backend.Shared.Abstracts;

namespace backend.Modules.BoardingManagement.Domain.Entities
{
    public class Boarding : BaseEntity
    {
        public Guid profileId { get; set; }

        public Guid busId { get; set; }

        public Guid stopId { get; set; }

        public DateTime dateTime { get; set; }

        public bool action { get; set; }

        public required Profile profile { get; set; }

        public required Bus bus { get; set; }

        public required Stop stop { get; set; }
    }
}
