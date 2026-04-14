using backend.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace backend.Configuration
{
    public class PersonConfiguration : IEntityTypeConfiguration<Person>
    {
        public void Configure(EntityTypeBuilder<Person> builder)
        {
            builder.HasKey(pe => pe.personId);
            builder.Property(pe => pe.name).HasMaxLength(255);
            builder.Property(pe => pe.lastName).HasMaxLength(255);
            builder.Property(pe => pe.identificationType).HasMaxLength(255);
            builder.Property(pe => pe.identificationNumber).HasMaxLength(255);
            builder.Property(pe => pe.email).HasMaxLength(255);
            builder.Property(pe => pe.residenceAddress).HasMaxLength(255);
            builder.HasMany(pe => pe.Profiles).WithOne(pro => pro.Person).HasForeignKey(pro => pro.PersonId);
        }
    }
}
