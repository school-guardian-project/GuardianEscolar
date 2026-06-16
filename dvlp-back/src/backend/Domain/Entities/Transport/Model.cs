using backend.Domain.Entities.Transport;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Domain.Entities.Transport
{
    public class Model
    {
        public int modelId { get; set; }

        public int year { get; set; }

        public ICollection<LineModel> lineModel { get; set; } = new List<LineModel>();
    }
}
