using Medo;

namespace backend.Modules.Security.Domain.Entities
{
    public class ViewModule
    {
        public Uuid7 viewModuleId { get; set; } = Uuid7.NewUuid7();

        public Uuid7 viewId { get; set; }

        public Uuid7 moduleId { get; set; }

        public Module module { get; set; }

        public View view { get; set; }
    }
}
