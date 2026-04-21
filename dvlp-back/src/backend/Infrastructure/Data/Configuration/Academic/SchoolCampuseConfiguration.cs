using backend.Model.Entities.Academic;
using backend.Model.Entities.School;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace backend.Infrastructure.Persistence.Configuration.Academic
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