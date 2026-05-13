using backend.Domain.Entities.Users;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace backend.Infrastructure.Persistence.Configuration.Users
{
    public class ProfileConfiguration : IEntityTypeConfiguration<Profile>
    {
        public void Configure(EntityTypeBuilder<Profile> builder)
        {
            builder.HasKey(p => p.Id);
            builder.Property(p => p.password).HasMaxLength(255);
            // Esta es una relacion de uno a muchos, donde una persona tiene muchos perfiles.
            // Un perfil tiene una persona y una persona tiene muchos perfiles e indica la llave foranea FK
            builder.HasOne(p => p.person).WithMany(pe => pe.profiles).HasForeignKey(p => p.personId);
        }
    }
}