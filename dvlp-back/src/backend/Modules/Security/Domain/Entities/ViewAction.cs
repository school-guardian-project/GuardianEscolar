using Medo;

namespace backend.Modules.Security.Domain.Entities
{
    public class ViewAction
    {
        public Uuid7 Id { get; set; } = Uuid7.NewUuid7();

        public Uuid7 viewId { get; set; }

        public Uuid7 actionId { get; set; }

        public View view { get; set; }

        public Action action { get; set; }
    }
}
