using backend.Modules.UserManagement.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace backend.Modules.UserManagement.Infrastructure.Configurations
{
    public class PersonConfiguration : IEntityTypeConfiguration<Person>
    {
        public void Configure(EntityTypeBuilder<Person> builder)
        {
            builder.Property(pe => pe.name).HasMaxLength(50);
            builder.Property(pe => pe.lastName).HasMaxLength(50);
            builder.HasOne(pe => pe.IdentificationType).WithOne(it => it.person).HasForeignKey<Person>(pe => pe.identificationId);
            builder.Property(pe => pe.email).HasMaxLength(50);
            builder.Property(pe => pe.residenceAddress).HasMaxLength(50);
        }
    }
}
