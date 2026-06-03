using Medo;

namespace backend.Modules.FleetManagement.Domain.Entities
{
    public class Model
    {
        public Uuid7 Id { get; set; } = Uuid7.NewUuid7();

        public int year { get; set; }

        public ICollection<LineModel> lineModel { get; set; } = new List<LineModel>();
    }
}
