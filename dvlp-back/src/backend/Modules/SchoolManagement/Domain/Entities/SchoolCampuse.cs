namespace backend.Modules.SchoolManagement.Domain.Entities
{
    public class SchoolCampuse
    {
        public Guid schoolCampuseId { get; set; } = Guid.NewGuid();

        public Guid schoolId { get; set; }

        public string? name { get; set; }

        public string? address { get; set; }

        public SchoolEntity school { get; set; }

        public ICollection<Course> courses { get; set; } = new List<Course>();
    }
}
