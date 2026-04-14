using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Entities
{
    public class Profile
    {
        [Key]
        public int Id { get; set; }

        public int PersonId { get; set; }

        public Person Person { get; set; } = null!;

        [StringLength(maximumLength: 255)]
        public string? password { get; set; }
    }
}