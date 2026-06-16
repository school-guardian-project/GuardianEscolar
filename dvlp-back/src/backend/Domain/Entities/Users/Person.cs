using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Domain.Entities.Users
{
    public class Person
    {
        public int personId { get; set; }

        public string? name { get; set; }

        public string? lastName { get; set; }

<<<<<<< HEAD
        public string? identificationType { get; set; }

        public string? identificationNumber { get; set; }
=======
        public int identificationId { get; set; }
>>>>>>> develop

        public string? email { get; set; }

        public int? phone { get; set; }

        public string? residenceAddress { get; set; }

        public ICollection<Profile> profiles { get; set; } = new List<Profile>();
<<<<<<< HEAD
=======
    
        public IdentificationType IdentificationType { get; set; } = null!;
>>>>>>> develop
    }
}
