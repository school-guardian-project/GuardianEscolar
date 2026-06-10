using backend.Modules.Security.Domain.Entities;
using backend.Shared.Abstracts;

namespace backend.Modules.FleetManagement.Domain.Entities
{
    public class ExceptionalDriverUsage : BaseEntity
    {
        public Guid busId { get; set; }

        public Guid profileId { get; set; }

        public DateTime startDateTime { get; set; }

        public DateTime endDateTime { get; set; }

        public string reason { get; set; }

        public Bus bus { get; set; }

        public Profile profile { get; set; }
    }
}
