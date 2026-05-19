using backend.Domain.Entities.Academic;
using backend.Domain.Entities.Alerts;
using backend.Domain.Entities.Exceptions;
using backend.Domain.Entities.Family;
using backend.Domain.Entities.School;
using backend.Domain.Entities.Security;
using backend.Domain.Entities.Transport;
using backend.Domain.Entities.Users;
using backend.Infrastructure.Persistence.Configuration.Academic;
using backend.Infrastructure.Persistence.Configuration.Alerts;
using backend.Infrastructure.Persistence.Configuration.Exceptions;
using backend.Infrastructure.Persistence.Configuration.Family;
using backend.Infrastructure.Persistence.Configuration.School;
using backend.Infrastructure.Persistence.Configuration.Security;
using backend.Infrastructure.Persistence.Configuration.Transport;
using backend.Infrastructure.Persistence.Configuration.Users;
using Microsoft.EntityFrameworkCore;
using RouteEntity = backend.Domain.Entities.Transport.RouteEntity;
using ActionEntity = backend.Domain.Entities.Security.Action;
using FamilyEntity = backend.Domain.Entities.Family.Family;

namespace backend.Infrastructure.Persistence.Context
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions options) : base(options)
        {
        }

        public DbSet<Person> Person => Set<Person>();
        public DbSet<Profile> Profile => Set<Profile>();
        public DbSet<ProfileRole> ProfileRole => Set<ProfileRole>();
        public DbSet<AlertType> AlertType => Set<AlertType>();
        public DbSet<Alert> Alert => Set<Alert>();
        public DbSet<SavedAlert> SavedAlert => Set<SavedAlert>();
        public DbSet<City> City => Set<City>();
        public DbSet<SchoolEntity> School => Set<SchoolEntity>();
        public DbSet<SchoolCampuse> SchoolCampuse => Set<SchoolCampuse>();
        public DbSet<Course> Course => Set<Course>();
        public DbSet<CourseGroup> CourseGroup => Set<CourseGroup>();
        public DbSet<Bus> Bus => Set<Bus>();
        public DbSet<RouteEntity> Route => Set<RouteEntity>();
        public DbSet<Stop> Stop => Set<Stop>();
        public DbSet<Boarding> Boarding => Set<Boarding>();
        public DbSet<RouteBusAssignments> RouteBusAssignments => Set<RouteBusAssignments>();
        public DbSet<RouteStop> RouteStop => Set<RouteStop>();
        public DbSet<RouteStudentAssignments> RouteStudentAssignments => Set<RouteStudentAssignments>();
        public DbSet<FamilyEntity> Family => Set<FamilyEntity>();
        public DbSet<FamilyMember> FamilyMember => Set<FamilyMember>();
        public DbSet<DriverLicense> DriverLicense => Set<DriverLicense>();
        public DbSet<ExceptionalRouteUsage> ExceptionalRouteUsage => Set<ExceptionalRouteUsage>();
        public DbSet<ExceptionalDriverUsage> ExceptionalDriverUsage => Set<ExceptionalDriverUsage>();
        public DbSet<Role> Role => Set<Role>();
        public DbSet<Module> Module => Set<Module>();
        public DbSet<ActionEntity> Action => Set<ActionEntity>();
        public DbSet<View> View => Set<View>();
        public DbSet<ViewModule> ViewModule => Set<ViewModule>();
        public DbSet<RoleModule> RoleModule => Set<RoleModule>();
        public DbSet<Line> Line => Set<Line>();
        public DbSet<Model> Model => Set<Model>();
        public DbSet<LineModel> LineModel => Set<LineModel>();
        public DbSet<Brand> Brand => Set<Brand>();
        public DbSet<IdentificationType> IdentificationType => Set<IdentificationType>();

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.HasDefaultSchema("app");

            modelBuilder.Entity<Person>().ToTable("Person", schema: "app");
            modelBuilder.Entity<Profile>().ToTable("Profile", schema: "app");
            modelBuilder.Entity<ProfileRole>().ToTable("ProfileRole", schema: "app");
            modelBuilder.Entity<AlertType>().ToTable("AlertType", schema: "app");
            modelBuilder.Entity<Alert>().ToTable("Alert", schema: "app");
            modelBuilder.Entity<SavedAlert>().ToTable("SavedAlert", schema: "app");
            modelBuilder.Entity<City>().ToTable("City", schema: "app");
            modelBuilder.Entity<SchoolEntity>().ToTable("School", schema: "app");
            modelBuilder.Entity<SchoolCampuse>().ToTable("SchoolCampuse", schema: "app");
            modelBuilder.Entity<Course>().ToTable("Course", schema: "app");
            modelBuilder.Entity<CourseGroup>().ToTable("CourseGroup", schema: "app");
            modelBuilder.Entity<Bus>().ToTable("Bus", schema: "app");
            modelBuilder.Entity<RouteEntity>().ToTable("Route", schema: "app");
            modelBuilder.Entity<Stop>().ToTable("Stop", schema: "app");
            modelBuilder.Entity<Boarding>().ToTable("Boarding", schema: "app");
            modelBuilder.Entity<RouteBusAssignments>().ToTable("RouteBusAssignments", schema: "app");
            modelBuilder.Entity<RouteStop>().ToTable("RouteStop", schema: "app");
            modelBuilder.Entity<RouteStudentAssignments>().ToTable("RouteStudentAssignments", schema: "app");
            modelBuilder.Entity<Family>().ToTable("Family", schema: "app");
            modelBuilder.Entity<FamilyMember>().ToTable("FamilyMember", schema: "app");
            modelBuilder.Entity<DriverLicense>().ToTable("DriverLicense", schema: "app");
            modelBuilder.Entity<ExceptionalRouteUsage>().ToTable("ExceptionalRouteUsage", schema: "app");
            modelBuilder.Entity<ExceptionalDriverUsage>().ToTable("ExceptionalDriverUsage", schema: "app");
            modelBuilder.Entity<Role>().ToTable("Role", schema: "app");
            modelBuilder.Entity<Module>().ToTable("Module", schema: "app");
            modelBuilder.Entity<ActionEntity>().ToTable("Action", schema: "app");
            modelBuilder.Entity<View>().ToTable("View", schema: "app");
            modelBuilder.Entity<ViewModule>().ToTable("ViewModule", schema: "app");
            modelBuilder.Entity<RoleModule>().ToTable("RoleModule", schema: "app");
            modelBuilder.Entity<Line>().ToTable("Line", schema: "app");
            modelBuilder.Entity<Model>().ToTable("Model", schema: "app");
            modelBuilder.Entity<LineModel>().ToTable("LineModel", schema: "app");
            modelBuilder.Entity<Brand>().ToTable("Brand", schema: "app");
            modelBuilder.Entity<IdentificationType>().ToTable("IdentificationType", schema: "app");

            modelBuilder.ApplyConfiguration(new PersonConfiguration());
            modelBuilder.ApplyConfiguration(new ProfileConfiguration());
            modelBuilder.ApplyConfiguration(new ProfileRoleConfiguration());
            modelBuilder.ApplyConfiguration(new SchoolEntityConfiguration());
            modelBuilder.ApplyConfiguration(new CityConfiguration());
            modelBuilder.ApplyConfiguration(new CourseConfiguration());
            modelBuilder.ApplyConfiguration(new CourseGroupConfiguration());
            modelBuilder.ApplyConfiguration(new SchoolCampuseConfiguration());
            modelBuilder.ApplyConfiguration(new BusConfiguration());
            modelBuilder.ApplyConfiguration(new RouteConfiguration());
            modelBuilder.ApplyConfiguration(new StopConfiguration());
            modelBuilder.ApplyConfiguration(new BoardingConfiguration());
            modelBuilder.ApplyConfiguration(new RouteBusAssignmentsConfiguration());
            modelBuilder.ApplyConfiguration(new RouteStopConfiguration());
            modelBuilder.ApplyConfiguration(new RouteStudentAssignmentsConfiguration());
            modelBuilder.ApplyConfiguration(new FamilyConfiguration());
            modelBuilder.ApplyConfiguration(new FamilyMemberConfiguration());
            modelBuilder.ApplyConfiguration(new AlertConfiguration());
            modelBuilder.ApplyConfiguration(new AlertTypeConfiguration());
            modelBuilder.ApplyConfiguration(new SavedAlertsConfiguration());
            modelBuilder.ApplyConfiguration(new DriverLicenseConfiguration());
            modelBuilder.ApplyConfiguration(new ExceptionalRouteUsageConfiguration());
            modelBuilder.ApplyConfiguration(new ExceptionalDriverUsageConfiguration());
            modelBuilder.ApplyConfiguration(new RoleConfiguration());
            modelBuilder.ApplyConfiguration(new ModuleConfiguration());
            modelBuilder.ApplyConfiguration(new ActionConfiguration());
            modelBuilder.ApplyConfiguration(new ViewConfiguration());
            modelBuilder.ApplyConfiguration(new ViewModuleConfiguration());
            modelBuilder.ApplyConfiguration(new RoleModuleConfiguration());
            modelBuilder.ApplyConfiguration(new LineConfiguration());
            modelBuilder.ApplyConfiguration(new ModelConfiguration());
            modelBuilder.ApplyConfiguration(new LineModelConfiguration());
            modelBuilder.ApplyConfiguration(new BrandConfiguration());
            modelBuilder.ApplyConfiguration(new IdentificationTypeConfiguration());
        }

        protected AppDbContext()
        {
        }
    }
}