namespace backend.Modules.RouteManagement.Application.DTOs.Response;

public class StopResponseDto
{
    public Guid cityId { get; set; }

    public Guid schoolId { get; set; }

    public string address { get; set; }

    public decimal longitude { get; set; }

    public decimal latitude { get; set; }
}