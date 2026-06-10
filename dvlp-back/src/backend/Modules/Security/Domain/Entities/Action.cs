using backend.Shared.Abstracts;

namespace backend.Modules.Security.Domain.Entities
{
    public class Action : BaseEntity
    {
        public string name { get; set; }

        public string description { get; set; }

        public ICollection<ViewAction> viewActions { get; set; } = new List<ViewAction>();
    }
}
