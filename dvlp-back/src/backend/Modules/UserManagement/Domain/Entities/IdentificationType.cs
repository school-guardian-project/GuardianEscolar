using Medo;

namespace backend.Modules.UserManagement.Domain.Entities
{
    public class IdentificationType
    {
        public Uuid7 identificationId { get; set; } = Uuid7.NewUuid7();

        public String name { get; set; }

        public Person person { get; set; }
    }
}