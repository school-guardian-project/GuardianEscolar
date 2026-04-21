using backend.Domain.Entities.Users;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Domain.Entities.Security
{
    public class Role
    {
        public int id { get; set; }

        public string name { get; set; }

        public string description { get; set; }

        public string permissions { get; set; }

        public ICollection<ProfileRole> profileRoles { get; set; } = new List<ProfileRole>();

        public ICollection<RoleModule> roleModules { get; set; } = new List<RoleModule>();
    }
}
