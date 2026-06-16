using backend.Modules.AlertManagement.Domain.Entities;
using backend.Modules.BoardingManagement.Domain.Entities;
using backend.Modules.RouteManagement.Domain.Entities;
using backend.Modules.SchoolManagement.Domain.Entities;
using backend.Modules.Security.Domain.Entities;
using backend.Shared.Abstracts;

namespace backend.Modules.FleetManagement.Domain.Entities
{
    public class Bus : BaseEntity
    {
        public Guid driverId { get; set; }

        public Guid schoolId { get; set; }

<<<<<<< HEAD
        public string? brand { get; set; }

        public string? model { get; set; }

        public int capacity { get; set; }

=======
>>>>>>> develop
        public byte[]? soatValidity { get; set; }

        public bool gpsStatus { get; set; }

<<<<<<< HEAD:dvlp-back/src/backend/Domain/Entities/Transport/Bus.cs
<<<<<<< HEAD
        public SchoolEntity school { get; set; }

        public Profile driver { get; set; }
=======
        public int lineModelId { get; set; }
=======
        public Guid lineModelId { get; set; }
>>>>>>> origin/develop:dvlp-back/src/backend/Modules/FleetManagement/Domain/Entities/Bus.cs

        public SchoolEntity school { get; set; }

        public Profile driver { get; set; }

        public LineModel lineModel { get; set; }
>>>>>>> develop
        
        public ICollection<Alert> alerts { get; set; } = new List<Alert>();

        public ICollection<Boarding> boardings { get; set; } = new List<Boarding>();

        public ICollection<RouteBusAssignments> busAssignments { get; set; } = new List<RouteBusAssignments>();

        public ICollection<ExceptionalDriverUsage> exceptionalDriverUsages { get; set; } = new List<ExceptionalDriverUsage>();
    }
}
