using backend.Shared.Abstracts;

namespace backend.Modules.SchoolManagement.Domain.Entities
{
    public class Course : BaseEntity
    {
        public string? name { get; set; }

        public Guid campuseId { get; set; }

        public SchoolCampuse? campuse { get; set; }

        public ICollection<CourseGroup> courses { get; set; } = new List<CourseGroup>();
    }
}
