using backend.Modules.FleetManagement.Domain.Entities;
using backend.Shared.Abstracts;

namespace backend.Modules.AlertManagement.Domain.Entities
{
    public class Alert : BaseEntity
    {
        public Guid alertTypeId { get; set; }

        public Guid busId { get; set; }

        public DateTime dateTime { get; set; } = DateTime.UtcNow;

        public AlertType alertType { get; set; }

        public Bus bus { get; set; }

        public ICollection<SavedAlert> savedAlerts { get; set; } = new List<SavedAlert>();
    }
}
