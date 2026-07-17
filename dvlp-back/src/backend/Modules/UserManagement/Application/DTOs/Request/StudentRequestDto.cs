using backend.Modules.Security.Application.DTOs.Request;

namespace backend.Modules.UserManagement.Application.DTOs.Request;

public class StudentRequestDto : ProfileRequestDto
{
    public Guid courseId { get; set; }
    public string courseName { get; set; }

}