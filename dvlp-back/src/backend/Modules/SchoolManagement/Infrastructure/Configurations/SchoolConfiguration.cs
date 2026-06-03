using backend.Modules.SchoolManagement.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace backend.Modules.SchoolManagement.Infrastructure.Configurations
{
    public class SchoolEntityConfiguration : IEntityTypeConfiguration<SchoolEntity>
    {
        public void Configure(EntityTypeBuilder<SchoolEntity> builder)
        {
            builder.HasKey(s => s.Id);
            builder.Property(s => s.name).HasMaxLength(255);
            builder.Property(s => s.address).HasMaxLength(500);
            builder.Property(s => s.email).HasMaxLength(255);
            builder.Property(s => s.website).HasMaxLength(255);
            builder.Property(s => s.theme).HasMaxLength(100);
            builder.HasOne(s => s.city).WithMany(c => c.schools).HasForeignKey(s => s.cityId);
        }
    }
}