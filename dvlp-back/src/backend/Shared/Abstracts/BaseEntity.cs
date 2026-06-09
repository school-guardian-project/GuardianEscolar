namespace backend.Shared.Abstracts;

public abstract class BaseEntity
{
    public Guid id { get; set; } = Guid.NewGuid();

    public string status { get; set; }
}