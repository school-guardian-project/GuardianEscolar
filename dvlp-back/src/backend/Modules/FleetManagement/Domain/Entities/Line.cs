using backend.Shared.Abstracts;

namespace backend.Modules.FleetManagement.Domain.Entities
{
    public class Line : BaseEntity
    {
        public string? name { get; set; }

        public Guid brandId { get; set; }

        public Brand brand { get; set; }
        
        public ICollection<LineModel> lineModel { get; set; } = new List<LineModel>();
    }
}
