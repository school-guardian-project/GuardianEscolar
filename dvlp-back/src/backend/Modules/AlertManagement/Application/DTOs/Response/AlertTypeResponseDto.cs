namespace backend.Modules.AlertManagement.Application.DTOs.Response;

public class AlertTypeResponseDto
{
    public string? name { get; set; }

    public string? description { get; set; }

    public int? urgencyLevel { get; set; }

    public string status { get; set; }
}