using backend.Modules.Security.Domain.Entities;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Modules.AlertManagement.Domain.Entities
{
    public class SavedAlert
    {
        public int profileId { get; set; }

        public int alertId { get; set; }

        public Alert alerts { get; set; }

        public Profile profile { get; set; }
    }
}
