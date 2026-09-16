namespace backend.Modules.FleetManagement.Application.DTOs.Response;

public class LineModelResponseDto
{
    public Guid lineId { get; set; }

    public Guid modelId { get; set; }

    public int capacity { get; set; }

    public string plate { get; set; }

    public string status { get; set; }
}