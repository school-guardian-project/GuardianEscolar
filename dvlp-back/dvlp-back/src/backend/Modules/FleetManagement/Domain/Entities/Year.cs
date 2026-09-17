using backend.Shared.Abstracts;

namespace backend.Modules.FleetManagement.Domain.Entities
{
    public class Year : BaseEntity
    {
        public int year { get; set; }

        public ICollection<LineModel> lineModel { get; set; } = new List<LineModel>();
    }
}
