using backend.Modules.Security.Domain.Entities;
using Medo;

namespace backend.Modules.UserManagement.Domain.Entities
{
    public class DriverLicense
    {
        public Uuid7 Id { get; set; } = Uuid7.NewUuid7();

        public Uuid7 profileId { get; set; }

        public string? licenseNumber { get; set; }

        public byte[] drivingLicense { get; set; }

        public DateTime licenseExpirationDate { get; set; }

        public Profile profile { get; set; }
    }
}
