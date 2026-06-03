using backend.Modules.Security.Domain.Entities;

namespace backend.Modules.SchoolManagement.Domain.Entities
{
    public class CourseGroup
    {
        public int profileId { get; set; }

        public int courseId { get; set; }

        public Course course { get; set; }

        public Profile profile { get; set; }
    }
}
