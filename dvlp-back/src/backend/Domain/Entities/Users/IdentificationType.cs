using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Domain.Entities.Users
{
    public class IdentificationType
    {
        public int identificationId { get; set; }

        public String name { get; set; }

        public Person person { get; set; }
    }
}