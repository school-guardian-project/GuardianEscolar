using backend.Shared.Abstracts;

namespace backend.Modules.Security.Domain.Entities
{
    public class ViewAction : BaseEntity
    {
        public Guid viewId { get; set; }

        public Guid actionId { get; set; }

        public View view { get; set; }

        public Action action { get; set; }
    }
}
