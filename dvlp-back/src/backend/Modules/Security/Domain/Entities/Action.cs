namespace backend.Modules.Security.Domain.Entities
{
    public class Action
    {
        public Guid actionId { get; set; } = Guid.NewGuid();

        public string name { get; set; }

        public string description { get; set; }

        public ICollection<ViewAction> viewActions { get; set; } = new List<ViewAction>();
    }
}
