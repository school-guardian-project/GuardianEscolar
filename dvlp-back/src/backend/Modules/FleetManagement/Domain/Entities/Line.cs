using Medo;

namespace backend.Modules.FleetManagement.Domain.Entities
{
    public class Line
    {
        public Uuid7 lineId { get; set; } = Uuid7.NewUuid7();

        public string? name { get; set; }

        public Uuid7 brandId { get; set; }

        public Brand brand { get; set; }
        
        public ICollection<LineModel> lineModel { get; set; } = new List<LineModel>();
    }
}
