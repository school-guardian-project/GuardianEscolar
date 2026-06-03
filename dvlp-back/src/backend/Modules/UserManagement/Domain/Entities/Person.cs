using backend.Modules.Security.Domain.Entities;

namespace backend.Modules.UserManagement.Domain.Entities
{
    public class Person
    {
        public Guid personId { get; set; } = Guid.NewGuid();

        public string? name { get; set; }

        public string? lastName { get; set; }

        public Guid identificationId { get; set; }

        public string? email { get; set; }

        public int? phone { get; set; }

        public string? residenceAddress { get; set; }

        public ICollection<Profile> profiles { get; set; } = new List<Profile>();
    
        public IdentificationType IdentificationType { get; set; } = null!;
    }
}
