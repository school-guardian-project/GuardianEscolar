namespace backend.Modules.AlertManagement.Application.DTOs.AlertsDto;

public class AlertResponseDto
{
    public Guid alertTypeId { get; set; }

    public Guid busId { get; set; }

    public DateTime dateTime { get; set; }
}