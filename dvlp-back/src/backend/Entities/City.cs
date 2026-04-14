using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Entities
{
    public class City
    {
        [Key]
        public int Id { get; set; }

        [StringLength(maximumLength: 255)]
        public string? name { get; set; }

        [StringLength(maximumLength: 255)]
        public string? country { get; set; }
    }
}
