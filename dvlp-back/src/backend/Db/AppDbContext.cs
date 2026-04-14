using backend.Entities;
using backend.Migrations;
using Microsoft.EntityFrameworkCore;

namespace backend.Db
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions options) : base(options)
        {
        }

        public DbSet<Person> Person => Set<Person>();

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.HasDefaultSchema("public");
            modelBuilder.Entity<Person>().ToTable("Person", schema: "app");
            modelBuilder.Entity<Ejemplo>().ToTable("Entity", schema: "app");

            // Una manera de indicar el id de la tabla es PK. Metodo aplifuente
            modelBuilder.Entity<Person>().HasKey(p => p.Id);
        }

        protected AppDbContext()
        {
        }
    }
}
