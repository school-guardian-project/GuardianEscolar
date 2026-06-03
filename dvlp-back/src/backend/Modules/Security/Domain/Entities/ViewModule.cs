using Medo;

namespace backend.Modules.Security.Domain.Entities
{
    public class ViewModule
    {
        public Uuid7 Id { get; set; } = Uuid7.NewUuid7();

        public Uuid7 ViewId { get; set; }

        public Uuid7 ModuleId { get; set; }

        public Module Module { get; set; }

        public View View { get; set; }
    }
}
