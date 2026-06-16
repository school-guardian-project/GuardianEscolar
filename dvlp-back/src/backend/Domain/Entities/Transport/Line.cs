using backend.Domain.Entities.Transport;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Domain.Entities.Transport
{
    public class Line
    {
        public int lineId { get; set; }

        public string? name { get; set; }

        public int brandId { get; set; }

        public Brand brand { get; set; }
        
        public ICollection<LineModel> lineModel { get; set; } = new List<LineModel>();
    }
}
