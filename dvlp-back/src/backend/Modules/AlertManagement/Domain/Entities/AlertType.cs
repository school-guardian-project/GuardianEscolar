using backend.Shared.Abstracts;

namespace backend.Modules.AlertManagement.Domain.Entities
{
    public class AlertType : BaseEntity
    {
        public string? name { get; set; }

        public string? description { get; set; }

        public byte? urgencyLevel { get; set; }

        public ICollection<Alert> alerts { get; set; } = new List<Alert>();
    }
}
