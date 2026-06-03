using Medo;

namespace backend.Modules.Security.Domain.Entities
{
    public class Module
    {
        public Uuid7 Id { get; set; } = Uuid7.NewUuid7();

        public string name { get; set; }

        public string description { get; set; }

        public ICollection<RoleModule> roleModules { get; set; } = new List<RoleModule>();
        public ICollection<ViewModule> viewModules { get; set; } = new List<ViewModule>();
    }
}
