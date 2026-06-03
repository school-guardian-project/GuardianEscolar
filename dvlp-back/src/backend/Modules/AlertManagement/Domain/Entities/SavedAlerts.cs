using backend.Modules.Security.Domain.Entities;
using Medo;

namespace backend.Modules.AlertManagement.Domain.Entities
{
    public class SavedAlert
    {
        public Uuid7 Id { get; set; } = Uuid7.NewUuid7();

        public Uuid7 profileId { get; set; }

        public Uuid7 alertId { get; set; }

        public Alert alerts { get; set; }

        public Profile profile { get; set; }
    }
}
