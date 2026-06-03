using Medo;

namespace backend.Modules.SchoolManagement.Domain.Entities
{
    public class Course
    {
        public Uuid7 Id { get; set; } = Uuid7.NewUuid7();

        public string? name { get; set; }

        public Uuid7 campuseId { get; set; }

        public SchoolCampuse? campuse { get; set; }

        public ICollection<CourseGroup> courses { get; set; } = new List<CourseGroup>();
    }
}
