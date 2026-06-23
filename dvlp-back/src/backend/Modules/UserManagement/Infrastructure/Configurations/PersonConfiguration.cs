using backend.Modules.UserManagement.Domain.Entities;
using backend.Shared.Infrastructure.Configuration;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace backend.Modules.UserManagement.Infrastructure.Configurations
{
    public class PersonConfiguration : BaseEntityConfiguration<Person>
    {
        public override void Configure(EntityTypeBuilder<Person> builder)
        {
            builder.Property(pe => pe.name).HasMaxLength(50);
            builder.Property(pe => pe.lastName).HasMaxLength(50);
            builder.HasOne(pe => pe.IdentificationType).WithMany(it => it.people).HasForeignKey(pe => pe.identificationId);
            builder.Property(pe => pe.email).HasMaxLength(50);
            builder.Property(pe => pe.residenceAddress).HasMaxLength(50);
        }
    }
}
