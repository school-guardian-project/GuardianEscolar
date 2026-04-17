using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Domain.Entities.Academic
{
    public class Course
    {
        public int Id { get; set; }

        public string? name { get; set; }

        public int campuseId { get; set; }

        public SchoolCampuse? campuse { get; set; }

        public ICollection<CourseGroup> courses { get; set; } = new List<CourseGroup>();
    }
}
