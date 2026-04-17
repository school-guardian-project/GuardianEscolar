using backend.Domain.Entities.Users;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Domain.Entities.Family
{
    public class FamilyMember
    {
        public int FamilyId { get; set; }

        public int ProfileId { get; set; }

        public Family Family { get; set; }

        public Profile Profile { get; set; }
    }
}
