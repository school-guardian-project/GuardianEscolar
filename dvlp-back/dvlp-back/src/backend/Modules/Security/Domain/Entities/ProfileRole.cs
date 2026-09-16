using backend.Shared.Abstracts;

namespace backend.Modules.Security.Domain.Entities
{
    public class ProfileRole : BaseEntity
    {
        public Guid roleId { get; set; }

        public Guid profileId { get; set; }

        // Se identifica la relacion con que entidad
        public Profile profile { get; set; }

        public Role role { get; set; }
    }
}
