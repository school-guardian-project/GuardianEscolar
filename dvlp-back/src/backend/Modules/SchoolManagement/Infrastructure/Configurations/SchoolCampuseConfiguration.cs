using backend.Modules.SchoolManagement.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace backend.Modules.SchoolManagement.Infrastructure.Configurations
{
    public class SchoolCampuseConfiguration : IEntityTypeConfiguration<SchoolCampuse>
    {
        public void Configure(EntityTypeBuilder<SchoolCampuse> builder)
        {
            builder.HasKey(sc => sc.campuseId);
            builder.Property(sc => sc.name).HasMaxLength(255);
            builder.Property(sc => sc.address).HasMaxLength(500);
            builder.HasOne(sc => sc.school).WithMany().HasForeignKey(sc => sc.schoolId);
        }
    }
}