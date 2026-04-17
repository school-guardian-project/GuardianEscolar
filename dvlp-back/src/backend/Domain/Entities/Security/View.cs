using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Domain.Entities.Security
{
    public class View
    {
        public int id { get; set; }

        public string name { get; set; }

        public string description { get; set; }

        public ICollection<ViewModule> viewModules { get; set; } = new List<ViewModule>();

        public ICollection<ViewAction> viewActions { get; set; } = new List<ViewAction>();
    }
}
