using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Modules.FleetManagement.Domain.Entities
{
    public class Model
    {
        public int modelId { get; set; }

        public int year { get; set; }

        public ICollection<LineModel> lineModel { get; set; } = new List<LineModel>();
    }
}
