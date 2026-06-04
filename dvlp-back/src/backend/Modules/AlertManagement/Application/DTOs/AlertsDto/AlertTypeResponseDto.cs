namespace backend.Modules.AlertManagement.Application.DTOs.AlertsDto;

public class AlertTypeResponseDto
{
    public string? name { get; set; }

    public string? description { get; set; }

    public int? urgencyLevel { get; set; }
}