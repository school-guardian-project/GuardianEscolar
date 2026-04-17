using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Domain.Entities.Security
{
    public class Module
    {
        public int id { get; set; }

        public string name { get; set; }

        public string description { get; set; }

        public ICollection<RoleModule> roleModules { get; set; } = new List<RoleModule>();
        public ICollection<ViewModule> viewModules { get; set; } = new List<ViewModule>();
    }
}
