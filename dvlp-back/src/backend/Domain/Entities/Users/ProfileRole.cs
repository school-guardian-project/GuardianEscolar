using backend.Domain.Entities.Security;

namespace backend.Domain.Entities.Users
{
    public class ProfileRole
    {
        public int Id { get; set; }

        public int roleId { get; set; }

        public int profileId { get; set; }

        // Se identifica la relacion con que entidad
        public Profile profile { get; set; }

        public Role role { get; set; }
    }
}
