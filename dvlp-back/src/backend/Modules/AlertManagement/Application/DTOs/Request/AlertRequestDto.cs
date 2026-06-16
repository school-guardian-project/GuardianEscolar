namespace backend.Modules.AlertManagement.Application.DTOs.Request;

public class AlertRequestDto
{
    public Guid alertTypeId { get; set; }

    public Guid busId { get; set; }

    public string status{ get; set; }
}