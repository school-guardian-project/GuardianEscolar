namespace backend.Modules.FleetManagement.Application.DTOs.Response;

public class BusResponseDto
{
    public Guid busId { get; set; } = Guid.NewGuid();

    public Guid driverId { get; set; }

    public Guid schoolId { get; set; }

    public byte[]? soatValidity { get; set; }

    public bool gpsStatus { get; set; }

    public Guid lineModelId { get; set; }
}