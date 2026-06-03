using backend.Modules.Security.Domain.Entities;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Modules.UserManagement.Domain.Entities
{
    public class FamilyMember
    {
        public int FamilyId { get; set; }

        public int ProfileId { get; set; }

        public Family Family { get; set; }

        public Profile Profile { get; set; }
    }
}
