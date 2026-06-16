using backend.Shared.Abstracts;

namespace backend.Modules.FleetManagement.Domain.Entities
{
    public class LineModel : BaseEntity
    {
        public Guid lineId { get; set; }

        public Guid modelId { get; set; }

        public int capacity { get; set; }

        public string plate { get; set; }

        public Line line { get; set; }

        public Year Year { get; set; }

        public ICollection<Bus> bus { get; set; } = new List<Bus>();
    }
}
