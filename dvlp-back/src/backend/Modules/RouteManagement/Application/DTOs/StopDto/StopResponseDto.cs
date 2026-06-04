namespace backend.Modules.RouteManagement.Application.DTOs.StopDto;

public class StopResponseDto
{
    public Guid cityId { get; set; }

    public Guid schoolId { get; set; }

    public string address { get; set; }

    public decimal longitude { get; set; }

    public decimal latitude { get; set; }
}