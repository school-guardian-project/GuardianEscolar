using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Modules.FleetManagement.Domain.Entities
{
    public class Line
    {
        public int lineId { get; set; }

        public string? name { get; set; }

        public int brandId { get; set; }

        public Brand brand { get; set; }
        
        public ICollection<LineModel> lineModel { get; set; } = new List<LineModel>();
    }
}
