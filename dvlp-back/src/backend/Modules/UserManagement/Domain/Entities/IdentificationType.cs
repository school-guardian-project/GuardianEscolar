using backend.Shared.Abstracts;

namespace backend.Modules.UserManagement.Domain.Entities
{
    public class IdentificationType : BaseEntity
    {
        public string name { get; set; }

        public Person person { get; set; }
    }
}