namespace backend.Modules.FleetManagement.Application.DTOs.Response;

public class BusResponseDto
{
    public Guid driverId { get; set; }

    public Guid schoolId { get; set; }

    public byte[]? soatValidity { get; set; }

    public bool gpsStatus { get; set; }

    public Guid lineModelId { get; set; }

    public string status { get; set; }
}