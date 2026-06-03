using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Modules.UserManagement.Domain.Entities
{
    public class Family
    {
        public int Id { get; set; }

        public string? name { get; set; }

        public string? observations { get; set; }

        public ICollection<FamilyMember>? members { get; set; }
    }
}
