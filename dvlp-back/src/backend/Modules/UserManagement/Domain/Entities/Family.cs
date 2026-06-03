namespace backend.Modules.UserManagement.Domain.Entities
{
    public class Family
    {
        public Guid familyId { get; set; } = Guid.NewGuid();

        public string? name { get; set; }

        public string? observations { get; set; }

        public ICollection<FamilyMember>? members { get; set; }
    }
}
