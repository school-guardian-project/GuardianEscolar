using Medo;

namespace backend.Modules.UserManagement.Domain.Entities
{
    public class Family
    {
        public Uuid7 familyId { get; set; } = Uuid7.NewUuid7();

        public string? name { get; set; }

        public string? observations { get; set; }

        public ICollection<FamilyMember>? members { get; set; }
    }
}
