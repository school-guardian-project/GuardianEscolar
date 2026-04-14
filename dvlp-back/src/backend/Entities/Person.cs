using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Entities
{
    public class Person
    {
        [Key]
        public int Id { get; set; }
        // Convencion para aplicar limite de caracteres a un campo
        [StringLength(maximumLength: 255)]
        public string? name { get; set; }

        [StringLength(maximumLength: 255)]
        public string? lastName { get; set; }

        [StringLength(maximumLength: 255)]
        public string? identificationType { get; set; }

        [StringLength(maximumLength: 255)]
        public string? identificationNumber { get; set; }

        [StringLength(maximumLength: 255)]
        public string? email { get; set; }

        public int? phone { get; set; }

        [StringLength(maximumLength: 255)]
        public string? residenceAddress { get; set; }

        public ICollection<Profile> Profiles { get; set; } = new List<Profile>();
    }
}
