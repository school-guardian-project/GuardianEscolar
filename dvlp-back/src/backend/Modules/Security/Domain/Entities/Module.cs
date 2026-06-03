namespace backend.Modules.Security.Domain.Entities
{
    public class Module
    {
        public Guid moduleId { get; set; } = Guid.NewGuid();

        public string name { get; set; }

        public string description { get; set; }

        public ICollection<RoleModule> roleModules { get; set; } = new List<RoleModule>();
        public ICollection<ViewModule> viewModules { get; set; } = new List<ViewModule>();
    }
}
