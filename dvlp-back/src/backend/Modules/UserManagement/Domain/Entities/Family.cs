using backend.Shared.Abstracts;

namespace backend.Modules.UserManagement.Domain.Entities
{
    public class Family : BaseEntity
    {
        public string? name { get; set; }

        public string? observations { get; set; }

        public ICollection<FamilyMember>? members { get; set; }
    }
}
