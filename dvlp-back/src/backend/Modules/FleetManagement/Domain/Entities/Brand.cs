using Medo;

namespace backend.Modules.FleetManagement.Domain.Entities
{
    public class Brand
    {
        public Uuid7 brandId { get; set; } = Uuid7.NewUuid7();

        public string? name { get; set; }

        public ICollection<Line> line { get; set; } = new List<Line>();
    }
}
