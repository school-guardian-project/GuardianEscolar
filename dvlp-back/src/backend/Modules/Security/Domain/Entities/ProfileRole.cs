namespace backend.Modules.Security.Domain.Entities
{
    public class ProfileRole
    {
        public Guid profileRoleId { get; set; } = Guid.NewGuid();

        public Guid roleId { get; set; }

        public Guid profileId { get; set; }

        // Se identifica la relacion con que entidad
        public Profile profile { get; set; }

        public Role role { get; set; }
    }
}
