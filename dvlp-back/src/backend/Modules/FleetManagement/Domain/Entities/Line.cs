namespace backend.Modules.FleetManagement.Domain.Entities
{
    public class Line
    {
        public Guid lineId { get; set; } = Guid.NewGuid();

        public string? name { get; set; }

        public Guid brandId { get; set; }

        public Brand brand { get; set; }
        
        public ICollection<LineModel> lineModel { get; set; } = new List<LineModel>();
    }
}
