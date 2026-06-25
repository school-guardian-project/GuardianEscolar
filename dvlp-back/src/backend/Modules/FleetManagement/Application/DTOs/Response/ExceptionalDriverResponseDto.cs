using backend.Modules.FleetManagement.Application.DTOs.Request;

namespace backend.Modules.FleetManagement.Application.DTOs.Response;

public class ExceptionalDriverResponseDto : ExceptionalDriverUsageRequestDto
{
    public DateTime startDateTime { get; set; }

    public DateTime endDateTime { get; set; }

    public string status { get; set; }
}