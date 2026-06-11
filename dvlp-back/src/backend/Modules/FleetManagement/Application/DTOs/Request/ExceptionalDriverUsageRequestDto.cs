namespace backend.Modules.FleetManagement.Application.DTOs.Request;

public class ExceptionalDriverUsageRequestDto
{
    public Guid busId { get; set; }

    public Guid profileId { get; set; }

    public DateTime startDateTime { get; set; }

    public DateTime endDateTime { get; set; }

    public string reason { get; set; }

    public string bus { get; set; }
}