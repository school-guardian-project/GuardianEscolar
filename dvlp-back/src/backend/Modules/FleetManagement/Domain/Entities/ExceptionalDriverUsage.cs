using backend.Modules.Security.Domain.Entities;

namespace backend.Modules.FleetManagement.Domain.Entities
{
    public class ExceptionalDriverUsage
    {
        public Guid exceptionalDriverUsageId { get; set; } = Guid.NewGuid();

        public Guid busId { get; set; }

        public Guid profileId { get; set; }

        public DateTime startDateTime { get; set; }

        public DateTime endDateTime { get; set; }

        public string reason { get; set; }

        public Bus bus { get; set; }

        public Profile profile { get; set; }
    }
}
