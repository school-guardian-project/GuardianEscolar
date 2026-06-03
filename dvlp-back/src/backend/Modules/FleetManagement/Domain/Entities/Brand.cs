namespace backend.Modules.FleetManagement.Domain.Entities
{
    public class Brand
    {
        public Guid brandId { get; set; } = Guid.NewGuid();

        public string? name { get; set; }

        public ICollection<Line> line { get; set; } = new List<Line>();
    }
}
