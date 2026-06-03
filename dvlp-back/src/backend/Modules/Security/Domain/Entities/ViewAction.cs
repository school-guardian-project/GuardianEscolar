namespace backend.Modules.Security.Domain.Entities
{
    public class ViewAction
    {
        public Guid viewActionId { get; set; } = Guid.NewGuid();

        public Guid viewId { get; set; }

        public Guid actionId { get; set; }

        public View view { get; set; }

        public Action action { get; set; }
    }
}
