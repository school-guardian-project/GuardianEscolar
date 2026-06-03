using backend.Modules.Security.Domain.Entities;
using Medo;

namespace backend.Modules.UserManagement.Domain.Entities
{
    public class FamilyMember
    {
        public Uuid7 familyMemberId { get; set; } = Uuid7.NewUuid7();

        public Uuid7 familyId { get; set; }

        public Uuid7 profileId { get; set; }

        public Family family { get; set; }

        public Profile profile { get; set; }
    }
}
