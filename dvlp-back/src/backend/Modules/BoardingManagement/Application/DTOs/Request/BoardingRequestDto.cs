namespace backend.Modules.BoardingManagement.Application.DTOs.Request;

public class BoardingRequestDto
{
    public Guid profileId { get; set; }

    public Guid busId { get; set; }

    public Guid stopId { get; set; }

    public DateTime dateTime { get; set; }

    public bool action { get; set; }
}