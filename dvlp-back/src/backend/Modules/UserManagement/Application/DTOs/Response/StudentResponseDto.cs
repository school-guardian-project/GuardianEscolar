using backend.Modules.UserManagement.Application.DTOs.Request.Register;

namespace backend.Modules.UserManagement.Application.DTOs.Response;

public class StudentResponseDto
{
    public string name { get; set; }
    public string lastName { get; set; }
    public string identificationNumber { get; set; }
    public int? phone { get; set; }
    public string courseName { get; set; }
}