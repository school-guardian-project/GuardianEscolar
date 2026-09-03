using backend.Modules.Security.Domain.Entities;
using backend.Shared.Abstracts;

namespace backend.Modules.SchoolManagement.Domain.Entities
{
    public class CourseGroup : BaseEntity
    {
        public Guid profileId { get; set; }

        public Guid courseId { get; set; }

        public Course course { get; set; }

        public Profile profile { get; set; }
    }
}
