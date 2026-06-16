namespace backend.Modules.UserManagement.Application.DTOs.Response;

public class PersonResponseDto
{
    public string? name { get; set; }

    public string? lastName { get; set; }

    public Guid identificationId { get; set; }

    public string? email { get; set; }

    public int? phone { get; set; }

    public string? residenceAddress { get; set; }
    
    public string status { get; set; }
}