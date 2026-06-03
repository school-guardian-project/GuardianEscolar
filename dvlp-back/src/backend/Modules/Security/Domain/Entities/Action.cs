using Medo;

namespace backend.Modules.Security.Domain.Entities
{
    public class Action
    {
        public Uuid7 Id { get; set; } = Uuid7.NewUuid7();

        public string name { get; set; }

        public string description { get; set; }

        public ICollection<ViewAction> viewActions { get; set; } = new List<ViewAction>();
    }
}
