using backend.Modules.Security.Domain.Entities;
using Medo;

namespace backend.Modules.FleetManagement.Domain.Entities
{
    public class ExceptionalDriverUsage
    {
        public Uuid7 exceptionalDriverUsageId { get; set; } = Uuid7.NewUuid7();

        public Uuid7 busId { get; set; }

        public Uuid7 profileId { get; set; }

        public DateTime startDateTime { get; set; }

        public DateTime endDateTime { get; set; }

        public string reason { get; set; }

        public Bus bus { get; set; }

        public Profile profile { get; set; }
    }
}
