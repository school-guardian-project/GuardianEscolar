using backend.Modules.Security.Domain.Entities;

namespace backend.Modules.UserManagement.Domain.Entities
{
    public class DriverLicense
    {
        public Guid driverLicenseId { get; set; } = Guid.NewGuid();

        public Guid profileId { get; set; }

        public string? licenseNumber { get; set; }

        public byte[] drivingLicense { get; set; }

        public DateTime licenseExpirationDate { get; set; }

        public Profile profile { get; set; }
    }
}
