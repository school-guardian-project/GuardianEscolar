namespace backend.Modules.Security.Domain.Entities
{
    public class View
    {
        public Guid viewId { get; set; } = Guid.NewGuid();

        public string name { get; set; }

        public string description { get; set; }

        public ICollection<ViewModule> viewModules { get; set; } = new List<ViewModule>();

        public ICollection<ViewAction> viewActions { get; set; } = new List<ViewAction>();
    }
}
