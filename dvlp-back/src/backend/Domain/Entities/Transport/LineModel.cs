using backend.Domain.Entities.Transport;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Domain.Entities.Transport
{
    public class LineModel
    {
        public int lineModelId { get; set; }

        public int lineId { get; set; }

        public int modelId { get; set; }

        public int capacity { get; set; }

        public String plate { get; set; }

        public Line line { get; set; }

        public Model model { get; set; }

        public ICollection<Bus> bus { get; set; } = new List<Bus>();
    }
}
