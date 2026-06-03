using backend.Modules.Security.Domain.Entities;
using Medo;

namespace backend.Modules.UserManagement.Domain.Entities
{
    public class Person
    {
        public Uuid7 personId { get; set; } = Uuid7.NewUuid7();

        public string? name { get; set; }

        public string? lastName { get; set; }

        public Uuid7 identificationId { get; set; }

        public string? email { get; set; }

        public int? phone { get; set; }

        public string? residenceAddress { get; set; }

        public ICollection<Profile> profiles { get; set; } = new List<Profile>();
    
        public IdentificationType IdentificationType { get; set; } = null!;
    }
}
