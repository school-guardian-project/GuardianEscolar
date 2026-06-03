using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Modules.FleetManagement.Domain.Entities
{
    public class Brand
    {
        public int brandId { get; set; }

        public string? name { get; set; }

        public ICollection<Line> line { get; set; } = new List<Line>();
    }
}
