using Medo;

namespace backend.Modules.FleetManagement.Domain.Entities
{
    public class LineModel
    {
        public Uuid7 Id { get; set; } = Uuid7.NewUuid7();

        public Uuid7 lineId { get; set; }

        public Uuid7 modelId { get; set; }

        public int capacity { get; set; }

        public String plate { get; set; }

        public Line line { get; set; }

        public Model model { get; set; }

        public ICollection<Bus> bus { get; set; } = new List<Bus>();
    }
}
