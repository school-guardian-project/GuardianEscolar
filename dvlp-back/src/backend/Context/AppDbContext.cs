using backend.Configuration;
using backend.Entities;
using Microsoft.EntityFrameworkCore;

namespace backend.Db
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions options) : base(options)
        {
        }

        public DbSet<Person> Person => Set<Person>();
        public DbSet<Profile> Profile => Set<Profile>();
        public DbSet<AlertType> AlertType => Set<AlertType>();
        public DbSet<City> City => Set<City>();

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.HasDefaultSchema("public");
            modelBuilder.Entity<Person>().ToTable("Person", schema: "app");
            modelBuilder.Entity<City>().ToTable("City", schema: "app");
            modelBuilder.Entity<AlertType>().ToTable("AlertType", schema: "app");
            modelBuilder.Entity<Profile>().ToTable("Profile", schema: "app");

            // Una manera de indicar el id de la tabla es PK. Metodo aplifuente
            //modelBuilder.Entity<Person>().HasKey(p => p.Id);

            // Manera de implementar la cantidad de caracteres por medio de aplifuente
            //modelBuilder.Entity<Person>().Property(p => p.Name).HasMazLength(255);

            modelBuilder.ApplyConfiguration(new ProfileConfiguration());
            modelBuilder.ApplyConfiguration(new PersonConfiguration());

            // Alternativa a tener que hacer el aApplyConfiguration a cada una (Una sola linea para todo)
            // modelBuilder.ApplyConfigurationsFromAssembly(Assembly.GetExecutingAssembly());
        }

        protected AppDbContext()
        {
        }
    }
}
