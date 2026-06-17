namespace backend.Modules.FleetManagement.Application.DTOs.Request;

public class LIneModelRequestDto
{
    public Guid lineId { get; set; }

    public Guid modelId { get; set; }

    public int? capacity { get; set; }

    public string? plate { get; set; }

    public string? status { get; set; }
}