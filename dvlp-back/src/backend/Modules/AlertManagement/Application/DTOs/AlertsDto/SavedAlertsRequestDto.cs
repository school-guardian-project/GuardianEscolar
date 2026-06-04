namespace backend.Modules.AlertManagement.Application.DTOs.AlertsDto;

public class SavedAlertsRequestDto
{
    public Guid profileId { get; set; }

    public Guid alertId { get; set; }
}