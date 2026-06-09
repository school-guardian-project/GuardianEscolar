namespace backend.Modules.BoardingManagement.Application.DTOs.Response;

public class BoardingResponseDto
{
    public Guid profileId { get; set; }

    public Guid busId { get; set; }

    public Guid stopId { get; set; }

    public DateTime dateTime { get; set; }

    public bool action { get; set; }
}