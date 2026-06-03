namespace backend.Modules.Security.Domain.Entities
{
    public class ViewModule
    {
        public Guid viewModuleId { get; set; } = Guid.NewGuid();

        public Guid viewId { get; set; }

        public Guid moduleId { get; set; }

        public Module module { get; set; }

        public View view { get; set; }
    }
}
