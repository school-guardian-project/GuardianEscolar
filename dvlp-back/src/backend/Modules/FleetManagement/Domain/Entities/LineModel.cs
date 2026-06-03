namespace backend.Modules.FleetManagement.Domain.Entities
{
    public class LineModel
    {
        public Guid lineModelId { get; set; } = Guid.NewGuid();

        public Guid lineId { get; set; }

        public Guid modelId { get; set; }

        public int capacity { get; set; }

        public string plate { get; set; }

        public Line line { get; set; }

        public Model model { get; set; }

        public ICollection<Bus> bus { get; set; } = new List<Bus>();
    }
}
