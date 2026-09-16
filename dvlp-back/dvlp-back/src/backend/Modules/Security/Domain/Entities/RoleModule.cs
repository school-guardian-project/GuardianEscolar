using backend.Shared.Abstracts;

namespace backend.Modules.Security.Domain.Entities
{
    public class RoleModule : BaseEntity
    {
        public Guid roleId { get; set; }

        public Guid moduleId { get; set; }

        public Module module { get; set; }

        public Role role { get; set; }
    }
}
