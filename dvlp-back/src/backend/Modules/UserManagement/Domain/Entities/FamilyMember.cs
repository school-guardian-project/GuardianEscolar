using backend.Modules.Security.Domain.Entities;
using Medo;

namespace backend.Modules.UserManagement.Domain.Entities
{
    public class FamilyMember
    {
        public Uuid7 Id { get; set; } = Uuid7.NewUuid7();

        public Uuid7 FamilyId { get; set; }

        public Uuid7 ProfileId { get; set; }

        public Family Family { get; set; }

        public Profile Profile { get; set; }
    }
}
