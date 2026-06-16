using backend.Domain.Entities.Users;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace backend.Infrastructure.Persistence.Configuration.Users
{
    public class PersonConfiguration : IEntityTypeConfiguration<Person>
    {
        public void Configure(EntityTypeBuilder<Person> builder)
        {
            // Ests es la configuracion para las columnas/tablas de la db
            // Esta es la manera de identificar la PK
            builder.HasKey(pe => pe.personId);

            // Esta la forma de aplicar un tamaño de longitud de caracteres
            builder.Property(pe => pe.name).HasMaxLength(255);
            builder.Property(pe => pe.lastName).HasMaxLength(255);
            builder.HasOne(pe => pe.IdentificationType).WithOne(it => it.person).HasForeignKey<IdentificationType>(it => it.identificationId);
            builder.Property(pe => pe.email).HasMaxLength(255);
            builder.Property(pe => pe.residenceAddress).HasMaxLength(255);
        }
    }
}
