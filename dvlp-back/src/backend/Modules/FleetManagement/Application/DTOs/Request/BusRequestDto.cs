namespace backend.Modules.FleetManagement.Application.DTOs.Request;

public class BusRequestDto
{
    public Guid driverId { get; set; }

    public Guid schoolId { get; set; }

    public byte[]? soatValidity { get; set; }

    public bool gpsStatus { get; set; }

    public Guid lineModelId { get; set; }
}