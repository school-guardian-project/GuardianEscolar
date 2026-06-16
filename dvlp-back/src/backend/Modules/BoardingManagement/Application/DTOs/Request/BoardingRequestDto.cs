namespace backend.Modules.BoardingManagement.Application.DTOs.Request;

public class BoardingRequestDto
{
    public Guid profileId { get; set; }

    public Guid busId { get; set; }

    public Guid stopId { get; set; }

    public bool? action { get; set; }

    public string status { get; set; }
}