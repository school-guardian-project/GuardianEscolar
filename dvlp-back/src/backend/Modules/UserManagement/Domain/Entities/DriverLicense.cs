using backend.Modules.Security.Domain.Entities;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Modules.UserManagement.Domain.Entities
{
    public class DriverLicense
    {
        public int Id { get; set; }

        public int profileId { get; set; }

        public string? licenseNumber { get; set; }

        public byte[] drivingLicense { get; set; }

        public DateTime licenseExpirationDate { get; set; }

        public Profile profile { get; set; }
    }
}
