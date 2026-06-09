using backend.Modules.Security.Domain.Entities;
using backend.Shared.Abstracts;

namespace backend.Modules.UserManagement.Domain.Entities
{
    public class DriverLicense : BaseEntity
    {
        public Guid profileId { get; set; }

        public string? licenseNumber { get; set; }

        public byte[] drivingLicense { get; set; }

        public DateTime licenseExpirationDate { get; set; }

        public Profile profile { get; set; }
    }
}
