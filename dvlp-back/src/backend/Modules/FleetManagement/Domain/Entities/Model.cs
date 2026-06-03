namespace backend.Modules.FleetManagement.Domain.Entities
{
    public class Model
    {
        public Guid modelId { get; set; } = Guid.NewGuid();

        public int year { get; set; }

        public ICollection<LineModel> lineModel { get; set; } = new List<LineModel>();
    }
}
