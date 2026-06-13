namespace backend.Modules.AlertManagement.Application.DTOs.Request;

public class SavedAlertsRequestDto
{
    public Guid profileId { get; set; }

    public Guid alertId { get; set; }

    public string status { get; set; }
}