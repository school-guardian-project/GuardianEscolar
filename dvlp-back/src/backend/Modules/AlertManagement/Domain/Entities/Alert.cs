using backend.Modules.FleetManagement.Domain.Entities;
using Medo;

namespace backend.Modules.AlertManagement.Domain.Entities
{
    public class Alert
    {
        public Uuid7 alertId { get; set; } = Uuid7.NewUuid7();

        public Uuid7 alertTypeId { get; set; }

        public Uuid7 busId { get; set; }

        public DateTime dateTime { get; set; }

        public AlertType alertType { get; set; }

        public Bus bus { get; set; }

        public ICollection<SavedAlert> savedAlerts { get; set; } = new List<SavedAlert>();
    }
}
