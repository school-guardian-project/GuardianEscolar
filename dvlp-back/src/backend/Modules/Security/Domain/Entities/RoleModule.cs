using Medo;

namespace backend.Modules.Security.Domain.Entities
{
    public class RoleModule
    {
        public Uuid7 Id { get; set; } = Uuid7.NewUuid7();

        public Uuid7 roleId { get; set; }

        public Uuid7 moduleId { get; set; }

        public Module Module { get; set; }

        public Role Role { get; set; }
    }
}
