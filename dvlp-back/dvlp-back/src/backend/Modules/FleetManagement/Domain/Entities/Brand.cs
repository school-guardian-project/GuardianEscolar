using backend.Shared.Abstracts;

namespace backend.Modules.FleetManagement.Domain.Entities
{
    public class Brand : BaseEntity
    {
        public string? name { get; set; }

        public ICollection<Line> line { get; set; } = new List<Line>();
    }
}
