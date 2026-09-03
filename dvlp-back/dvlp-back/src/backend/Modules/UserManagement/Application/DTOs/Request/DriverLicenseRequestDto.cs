namespace backend.Modules.UserManagement.Application.DTOs.Request;

public class DriverLicenseRequestDto
{
    public Guid profileId { get; set; }

    public string licenseNumber { get; set; }

    public byte[]? drivingLicense { get; set; }

    public DateTime? licenseExpirationDate { get; set; }
}