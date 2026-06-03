using backend.Modules.Security.Domain.Entities;

namespace backend.Modules.SchoolManagement.Domain.Entities
{
    public class CourseGroup
    {
        public Guid courseGroupId { get; set; } = Guid.NewGuid();

        public Guid profileId { get; set; }

        public Guid courseId { get; set; }

        public Course course { get; set; }

        public Profile profile { get; set; }
    }
}
