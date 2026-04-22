using backend.Domain.Entities.School;

namespace backend.Domain.Entities.Academic
{
    public class SchoolCampuse
    {
        public int campuseId { get; set; }

        public int schoolId { get; set; }

        public string? name { get; set; }

        public string? address { get; set; }

        public SchoolEntity school { get; set; }

        public ICollection<Course> courses { get; set; } = new List<Course>();
    }
}
