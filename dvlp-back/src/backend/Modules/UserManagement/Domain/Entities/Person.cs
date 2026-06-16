using backend.Modules.Security.Domain.Entities;
using backend.Shared.Abstracts;

namespace backend.Modules.UserManagement.Domain.Entities
{
    public class Person : BaseEntity
    {
        public string? name { get; set; }

        public string? lastName { get; set; }

<<<<<<< HEAD:dvlp-back/src/backend/Domain/Entities/Users/Person.cs
<<<<<<< HEAD
        public string? identificationType { get; set; }

        public string? identificationNumber { get; set; }
=======
        public int identificationId { get; set; }
>>>>>>> develop
=======
        public Guid identificationId { get; set; }
>>>>>>> origin/develop:dvlp-back/src/backend/Modules/UserManagement/Domain/Entities/Person.cs

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
