namespace backend.Modules.SchoolManagement.Application.DTOs.Response;

public class SchoolResponseDto
{
    public Guid cityId { get; set; }

    public byte[] logo { get; set; }

    public string name { get; set; }

    public string address { get; set; }

    public int phone { get; set; }

    public string email { get; set; }

    public string website { get; set; }

    public string theme { get; set; }
    
    public string status { get; set; }
}