namespace backend.Modules.UserManagement.Application.DTOs.Request;

public class PersonRequestDto
{
    public string? name { get; set; }

    public string? lastName { get; set; }

    public Guid identificationId { get; set; }

    public string? email { get; set; }

    public int? phone { get; set; }

    public string? residenceAddress { get; set; }

    public string? password { get; set; }

    public Guid roleId { get; set; }
}