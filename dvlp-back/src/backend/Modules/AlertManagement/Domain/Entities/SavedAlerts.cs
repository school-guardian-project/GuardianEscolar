using backend.Modules.Security.Domain.Entities;

namespace backend.Modules.AlertManagement.Domain.Entities
{
    public class SavedAlert
    {
        public Guid savedAlertId { get; set; } = Guid.NewGuid();

        public Guid profileId { get; set; }

        public Guid alertId { get; set; }

        public Alert alerts { get; set; }

        public Profile profile { get; set; }
    }
}
