using backend.Modules.AlertManagement.Domain.Entities;
using backend.Modules.BoardingManagement.Domain.Entities;
using backend.Modules.FleetManagement.Domain.Entities;
using backend.Modules.RouteManagement.Domain.Entities;
using backend.Modules.SchoolManagement.Domain.Entities;
using backend.Modules.UserManagement.Domain.Entities;
using Medo;

namespace backend.Modules.Security.Domain.Entities
{
    public class Profile
    {
        public Uuid7 Id { get; set; } = Uuid7.NewUuid7();

        public Uuid7 personId { get; set; }

        public Person person { get; set; } = null!;

        public string? password { get; set; }

        // Esta la relacion de muno a muchos
        public ICollection<ProfileRole> profileRoles { get; set; } = new List<ProfileRole>();

        // Ejemplo: un perfil tiene muchas alertas guardads
        public ICollection<SavedAlert> savedAlerts { get; set; } = new List<SavedAlert>();

        // Un perfil(con rol de conductor) maneja varios/muchos buses
        public ICollection<Bus> driver { get; set; } = new List<Bus>();

        // Un perfil (con rol de estudiante) tiene asignado diferentes rutas
        public ICollection<RouteStudentAssignments> studentAssignments { get; set; } = new List<RouteStudentAssignments>();

        public ICollection<ExceptionalRouteUsage> exceptionalRouteUsages { get; set; } = new List<ExceptionalRouteUsage>();

        public ICollection<DriverLicense> driverLicenses { get; set; } = new List<DriverLicense>();

        public ICollection<FamilyMember> members { get; set; } = new List<FamilyMember>();

        public ICollection<Boarding> boardings { get; set; } = new List<Boarding>();

        public ICollection<ExceptionalDriverUsage> exceptions { get; set; } = new List<ExceptionalDriverUsage>();

        public ICollection<CourseGroup> courseGroups { get; set; } = new List<CourseGroup>();
    }
}