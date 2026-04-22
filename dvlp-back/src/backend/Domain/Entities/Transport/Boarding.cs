using backend.Domain.Entities.Users;

namespace backend.Domain.Entities.Transport
{
    public class Boarding
    {
        public int profileId { get; set; }

        public int busId { get; set; }

        public int stopId { get; set; }

        public DateTime dateTime { get; set; }

        public bool action { get; set; }

        public required Profile profile { get; set; }

        public required Bus bus { get; set; }

        public required Stop stop { get; set; }
    }
}
