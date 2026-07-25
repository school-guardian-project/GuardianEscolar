using backend.Modules.SchoolManagement.Domain.Entities;
using backend.Shared.Infrastructure.Configuration;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace backend.Modules.SchoolManagement.Infrastructure.Configurations
{
    public class SchoolCampuseConfiguration : BaseEntityConfiguration<SchoolCampuse>
    {
        public override void Configure(EntityTypeBuilder<SchoolCampuse> builder)
        {
            builder.Property(sc => sc.name).HasMaxLength(30);
            builder.Property(sc => sc.address).HasMaxLength(30);
            builder.HasOne(sc => sc.school).WithMany().HasForeignKey(sc => sc.schoolId);
        }
    }
}