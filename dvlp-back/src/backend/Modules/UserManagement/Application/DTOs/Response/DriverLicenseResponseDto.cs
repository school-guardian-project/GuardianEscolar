namespace backend.Modules.UserManagement.Application.DTOs.Response;

public class DriverLicenseResponseDto
{
    public Guid profileId { get; set; }

    public string licenseNumber { get; set; }

    public byte[] drivingLicense { get; set; }

    public DateTime licenseExpirationDate { get; set; }
    
    public string status { get; set; }
}