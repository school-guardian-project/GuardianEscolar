using backend.Domain.Entities.Users;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Domain.Entities.Alerts
{
    public class SavedAlert
    {
        public int profileId { get; set; }

        public int alertId { get; set; }

        public Alert alerts { get; set; }

        public Profile profile { get; set; }
    }
}
