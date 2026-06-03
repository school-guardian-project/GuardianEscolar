using backend.Modules.FleetManagement.Domain.Entities;
using backend.Modules.RouteManagement.Domain.Entities;
using backend.Modules.Security.Domain.Entities;
using Medo;

namespace backend.Modules.BoardingManagement.Domain.Entities
{
    public class Boarding
    {
        public Uuid7 Id { get; set; } = Uuid7.NewUuid7();

        public Uuid7 profileId { get; set; }

        public Uuid7 busId { get; set; }

        public Uuid7 stopId { get; set; }

        public DateTime dateTime { get; set; }

        public bool action { get; set; }

        public required Profile profile { get; set; }

        public required Bus bus { get; set; }

        public required Stop stop { get; set; }
    }
}
