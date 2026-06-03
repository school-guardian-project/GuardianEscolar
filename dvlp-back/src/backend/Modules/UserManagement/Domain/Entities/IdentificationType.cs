namespace backend.Modules.UserManagement.Domain.Entities
{
    public class IdentificationType
    {
        public Guid identificationId { get; set; } = Guid.NewGuid();

        public string name { get; set; }

        public Person person { get; set; }
    }
}