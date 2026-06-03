namespace backend.Modules.SchoolManagement.Domain.Entities
{
    public class Course
    {
        public Guid courseId { get; set; } = Guid.NewGuid();

        public string? name { get; set; }

        public Guid campuseId { get; set; }

        public SchoolCampuse? campuse { get; set; }

        public ICollection<CourseGroup> courses { get; set; } = new List<CourseGroup>();
    }
}
