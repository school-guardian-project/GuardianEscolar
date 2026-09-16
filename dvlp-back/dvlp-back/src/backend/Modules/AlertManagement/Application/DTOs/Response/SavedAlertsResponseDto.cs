namespace backend.Modules.AlertManagement.Application.DTOs.Response;

public class SavedAlertsResponseDto
{
    public Guid profileId { get; set; }

    public Guid alertId { get; set; }
}