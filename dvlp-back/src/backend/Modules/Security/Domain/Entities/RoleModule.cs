using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Modules.Security.Domain.Entities
{
    public class RoleModule
    {
        public int Id { get; set; }

        public int roleId { get; set; }

        public int moduleId { get; set; }

        public Module Module { get; set; }

        public Role Role { get; set; }
    }
}
