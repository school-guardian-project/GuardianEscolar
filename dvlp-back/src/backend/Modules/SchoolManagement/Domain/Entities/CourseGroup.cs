using backend.Modules.Security.Domain.Entities;
using Medo;

namespace backend.Modules.SchoolManagement.Domain.Entities
{
    public class CourseGroup
    {
        public Uuid7 Id { get; set; } = Uuid7.NewUuid7();

        public Uuid7 profileId { get; set; }

        public Uuid7 courseId { get; set; }

        public Course course { get; set; }

        public Profile profile { get; set; }
    }
}
