using backend.Modules.AlertManagement.Domain.Entities;
using backend.Modules.BoardingManagement.Domain.Entities;
using backend.Modules.RouteManagement.Domain.Entities;
using backend.Modules.SchoolManagement.Domain.Entities;
using backend.Modules.Security.Domain.Entities;
using Medo;

namespace backend.Modules.FleetManagement.Domain.Entities
{
    public class Bus
    {
        public Uuid7 busId { get; set; } = Uuid7.NewUuid7();

        public Uuid7 driverId { get; set; }

        public Uuid7 schoolId { get; set; }

        public byte[]? soatValidity { get; set; }

        public bool gpsStatus { get; set; }

        public Uuid7 lineModelId { get; set; }

        public SchoolEntity school { get; set; }

        public Profile driver { get; set; }

        public LineModel lineModel { get; set; }
        
        public ICollection<Alert> alerts { get; set; } = new List<Alert>();

        public ICollection<Boarding> boardings { get; set; } = new List<Boarding>();

        public ICollection<RouteBusAssignments> busAssignments { get; set; } = new List<RouteBusAssignments>();

        public ICollection<ExceptionalDriverUsage> exceptionalDriverUsages { get; set; } = new List<ExceptionalDriverUsage>();
    }
}
