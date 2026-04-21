using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Domain.Entities.Alerts
{
    public class AlertType
    {
        public int Id { get; set; }

        public string? name { get; set; }

        public string? description { get; set; }

        public int? urgencyLevel { get; set; }

        public ICollection<Alert> alerts { get; set; } = new List<Alert>();
    }
}
