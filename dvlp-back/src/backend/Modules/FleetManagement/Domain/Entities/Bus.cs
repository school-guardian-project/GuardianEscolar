using System.Runtime.InteropServices.JavaScript;
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

        public DateOnly soatValidity { get; set; }

        public bool gpsStatus { get; set; }

        public SchoolEntity school { get; set; }

        public Profile driver { get; set; }

        public Guid lineModelId { get; set; }

        public LineModel lineModel { get; set; }

        public ICollection<Alert> alerts { get; set; } = new List<Alert>();

        public ICollection<Boarding> boardings { get; set; } = new List<Boarding>();

        public ICollection<RouteBusAssignments> busAssignments { get; set; } = new List<RouteBusAssignments>();

        public ICollection<ExceptionalDriverUsage> exceptionalDriverUsages { get; set; } = new List<ExceptionalDriverUsage>();
    }
}
