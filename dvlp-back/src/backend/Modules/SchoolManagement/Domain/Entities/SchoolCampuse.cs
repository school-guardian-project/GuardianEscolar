using Medo;

namespace backend.Modules.SchoolManagement.Domain.Entities
{
    public class SchoolCampuse
    {
        public Uuid7 schoolCampuseId { get; set; } = Uuid7.NewUuid7();

        public Uuid7 schoolId { get; set; }

        public string? name { get; set; }

        public string? address { get; set; }

        public SchoolEntity school { get; set; }

        public ICollection<Course> courses { get; set; } = new List<Course>();
    }
}
