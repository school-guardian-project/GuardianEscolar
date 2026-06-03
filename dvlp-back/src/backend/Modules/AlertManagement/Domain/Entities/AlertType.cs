using Medo;

namespace backend.Modules.AlertManagement.Domain.Entities
{
    public class AlertType
    {
        public Uuid7 alertTypeId { get; set; } = Uuid7.NewUuid7();

        public string? name { get; set; }

        public string? description { get; set; }

        public int? urgencyLevel { get; set; }

        public ICollection<Alert> alerts { get; set; } = new List<Alert>();
    }
}
