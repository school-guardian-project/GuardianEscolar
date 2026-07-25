namespace backend.Modules.UserManagement.Application.DTOs.Request;

public class PersonRequestDto
{
    public string name { get; set; }

    public string lastName { get; set; }

    public Guid identificationId { get; set; }

    public string identificationNumber { get; set; }

    public string email { get; set; }

    public int? phone { get; set; }
    
    public DateOnly? dateBirth { get; set; }

    public string residenceAddress { get; set; }
}