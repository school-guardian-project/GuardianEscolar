using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Domain.Entities.Family
{
    public class Family
    {
        public int Id { get; set; }

        public string? name { get; set; }

        public string? observations { get; set; }

        public ICollection<FamilyMember>? members { get; set; }
    }
}
