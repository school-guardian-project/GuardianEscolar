using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Entities
{
    [Table("Person")]
    public class Person
    {
        [Key]
        public int Id { get; set; }
        // Convencion para aplicar limite de caracteres a un campo
        [StringLength(maximumLength: 150)]
        public string? Name { get; set; }
    }
}
