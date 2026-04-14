using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Entities
{
    public class AlertType
    {
        [Key]
        public int Id { get; set; }

        [StringLength(maximumLength: 255)]
        public string? name { get; set; }

        public string? description { get; set; }

        public int? urgencyLevel { get; set; }
    }
}
