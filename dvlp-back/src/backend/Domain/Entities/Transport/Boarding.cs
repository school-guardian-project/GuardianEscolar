using backend.Domain.Entities.Users;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Domain.Entities.Transport
{
    public class Boarding
    {
        public int profileId { get; set; }

        public int busId { get; set; }

        public int stopId { get; set; }

        public DateTime dateTime { get; set; }

        public bool action { get; set; }

        public Profile profile { get; set; }

        public Bus bus { get; set; }

        public Stop stop { get; set; }
    }
}
