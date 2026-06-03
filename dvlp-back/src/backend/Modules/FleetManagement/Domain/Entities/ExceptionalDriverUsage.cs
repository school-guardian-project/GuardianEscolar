using backend.Modules.Security.Domain.Entities;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Modules.FleetManagement.Domain.Entities
{
    public class ExceptionalDriverUsage
    {
        public int Id { get; set; }

        public int busId { get; set; }

        public int profileId { get; set; }

        public DateTime startDateTime { get; set; }

        public DateTime endDateTime { get; set; }

        public string reason { get; set; }

        public Bus bus { get; set; }

        public Profile profile { get; set; }
    }
}
