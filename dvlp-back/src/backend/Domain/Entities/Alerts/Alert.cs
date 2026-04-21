using backend.Domain.Entities.Transport;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Domain.Entities.Alerts
{
    public class Alert
    {
        public int Id { get; set; }

        public int alertTypeId { get; set; }

        public int busId { get; set; }

        public DateTime dateTime { get; set; }

        public AlertType alertType { get; set; }

        public Bus bus { get; set; }

        public ICollection<SavedAlert> savedAlerts { get; set; } = new List<SavedAlert>();
    }
}
