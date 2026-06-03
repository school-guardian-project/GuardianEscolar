namespace backend.Modules.AlertManagement.Domain.Entities
{
    public class AlertType
    {
        public Guid alertTypeId { get; set; } = Guid.NewGuid();

        public string? name { get; set; }

        public string? description { get; set; }

        public int? urgencyLevel { get; set; }

        public ICollection<Alert> alerts { get; set; } = new List<Alert>();
    }
}
