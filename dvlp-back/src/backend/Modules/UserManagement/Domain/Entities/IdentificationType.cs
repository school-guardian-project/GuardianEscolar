using Medo;

namespace backend.Modules.UserManagement.Domain.Entities
{
    public class IdentificationType
    {
        public Uuid7 Id { get; set; } = Uuid7.NewUuid7();

        public String name { get; set; }

        public Person person { get; set; }
    }
}