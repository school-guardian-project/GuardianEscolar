using Medo;

namespace backend.Modules.Security.Domain.Entities
{
    public class RoleModule
    {
        public Uuid7 roleModuleId { get; set; } = Uuid7.NewUuid7();

        public Uuid7 roleId { get; set; }

        public Uuid7 moduleId { get; set; }

        public Module module { get; set; }

        public Role role { get; set; }
    }
}
