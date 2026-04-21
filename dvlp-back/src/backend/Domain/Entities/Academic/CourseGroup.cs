using backend.Domain.Entities.Users;

namespace backend.Domain.Entities.Academic
{
    public class CourseGroup
    {
        public int profileId { get; set; }

        public int courseId { get; set; }

        public Course course { get; set; }

        public Profile profile { get; set; }
    }
}
