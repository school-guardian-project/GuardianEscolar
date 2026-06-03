using Medo;

namespace backend.Modules.Security.Domain.Entities
{
    public class ProfileRole
    {
        public Uuid7 profileRoleId { get; set; } = Uuid7.NewUuid7();

        public Uuid7 roleId { get; set; }

        public Uuid7 profileId { get; set; }

        // Se identifica la relacion con que entidad
        public Profile profile { get; set; }

        public Role role { get; set; }
    }
}
