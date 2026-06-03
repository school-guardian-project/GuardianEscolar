using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Modules.Security.Domain.Entities
{
    public class ViewModule
    {
        public int Id { get; set; }

        public int ViewId { get; set; }

        public int ModuleId { get; set; }

        public Module Module { get; set; }

        public View View { get; set; }
    }
}
