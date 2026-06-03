using backend.Modules.Security.Domain.Entities;

namespace backend.Modules.UserManagement.Domain.Entities
{
    public class FamilyMember
    {
        public Guid familyMemberId { get; set; } = Guid.NewGuid();

        public Guid familyId { get; set; }

        public Guid profileId { get; set; }

        public Family family { get; set; }

        public Profile profile { get; set; }
    }
}
