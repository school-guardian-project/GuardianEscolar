namespace backend.Modules.FleetManagement.Application.DTOs.Response;

public class ExceptionalDriverResponseDto
{
    public Guid busId { get; set; }

    public Guid profileId { get; set; }

    public DateTime startDateTime { get; set; }

    public DateTime endDateTime { get; set; }

    public string reason { get; set; }
}