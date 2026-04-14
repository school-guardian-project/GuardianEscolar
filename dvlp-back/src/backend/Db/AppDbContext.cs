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

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.HasDefaultSchema("public");
            modelBuilder.Entity<Person>().ToTable("Person", schema: "app");
        }

        protected AppDbContext()
        {
        }
    }
}
