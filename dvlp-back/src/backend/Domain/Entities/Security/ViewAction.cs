namespace backend.Domain.Entities.Security
{
    public class ViewAction
    {
        public int Id { get; set; }

        public int viewId { get; set; }

        public int actionId { get; set; }

        public View view { get; set; }

        public Action action { get; set; }
    }
}
