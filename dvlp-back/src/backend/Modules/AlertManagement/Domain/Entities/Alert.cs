using backend.Modules.FleetManagement.Domain.Entities;

namespace backend.Modules.AlertManagement.Domain.Entities
{
    public class Alert
    {
        public Guid alertId { get; set; } = Guid.NewGuid();

        public Guid alertTypeId { get; set; }

        public Guid busId { get; set; }

        public DateTime dateTime { get; set; }

        public AlertType alertType { get; set; }

        public Bus bus { get; set; }

        public ICollection<SavedAlert> savedAlerts { get; set; } = new List<SavedAlert>();
    }
}
