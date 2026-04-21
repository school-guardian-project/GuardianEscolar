using backend.Domain.Entities.Transport;
using backend.Domain.Entities.Users;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Domain.Entities.Exceptions
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
