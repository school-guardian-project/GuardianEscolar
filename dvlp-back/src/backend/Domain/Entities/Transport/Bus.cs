using backend.Domain.Entities.Users;
using backend.Domain.Entities.School;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using backend.Domain.Entities.Alerts;
using backend.Domain.Entities.Exceptions;

namespace backend.Domain.Entities.Transport
{
    public class Bus
    {
        public int Id { get; set; }

        public int driverId { get; set; }

        public int schoolId { get; set; }

        public byte[]? soatValidity { get; set; }

        public bool gpsStatus { get; set; }

        public int lineModelId { get; set; }

        public SchoolEntity school { get; set; }

        public Profile driver { get; set; }

        public LineModel lineModel { get; set; }
        
        public ICollection<Alert> alerts { get; set; } = new List<Alert>();

        public ICollection<Boarding> boardings { get; set; } = new List<Boarding>();

        public ICollection<RouteBusAssignments> busAssignments { get; set; } = new List<RouteBusAssignments>();

        public ICollection<ExceptionalDriverUsage> exceptionalDriverUsages { get; set; } = new List<ExceptionalDriverUsage>();
    }
}
