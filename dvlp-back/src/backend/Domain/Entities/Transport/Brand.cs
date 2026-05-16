using backend.Domain.Entities.Transport;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Domain.Entities.Transport
{
    public class Brand
    {
        public int brandId { get; set; }

        public string? name { get; set; }

        public ICollection<Line> line { get; set; } = new List<Line>();
    }
}
