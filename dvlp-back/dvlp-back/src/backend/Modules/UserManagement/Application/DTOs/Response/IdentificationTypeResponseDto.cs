namespace backend.Modules.UserManagement.Application.DTOs.Response;

public class IdentificationTypeResponseDto
{
    public Guid identificationId { get; set; } = Guid.NewGuid();
    
    public string name { get; set; }
    
    public string status { get; set; }
}