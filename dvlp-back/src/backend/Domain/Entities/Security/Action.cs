using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Domain.Entities.Security
{
    public class Action
    {
        public int id { get; set; }

        public string name { get; set; }

        public string description { get; set; }

        public ICollection<ViewAction> viewActions { get; set; } = new List<ViewAction>();
    }
}
