using backend.Modules.Security.Domain.Entities;
using backend.Shared.Abstracts;

namespace backend.Modules.UserManagement.Domain.Entities
{
    public class FamilyMember : BaseEntity
    {
        public Guid familyId { get; set; }

        public Guid profileId { get; set; }

        public Family family { get; set; }

        public Profile profile { get; set; }
    }
}
