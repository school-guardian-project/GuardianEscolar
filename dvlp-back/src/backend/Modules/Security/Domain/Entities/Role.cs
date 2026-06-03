using Medo;

namespace backend.Modules.Security.Domain.Entities
{
    public class Role
    {
        public Uuid7 Id { get; set; } = Uuid7.NewUuid7();

        public string name { get; set; }

        public string description { get; set; }

        public string permissions { get; set; }

        public ICollection<ProfileRole> profileRoles { get; set; } = new List<ProfileRole>();

        public ICollection<RoleModule> roleModules { get; set; } = new List<RoleModule>();
    }
}
