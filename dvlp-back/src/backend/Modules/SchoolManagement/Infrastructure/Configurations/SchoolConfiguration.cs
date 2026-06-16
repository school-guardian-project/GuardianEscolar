using backend.Modules.SchoolManagement.Domain.Entities;
using backend.Shared.Infrastructure.Configuration;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace backend.Modules.SchoolManagement.Infrastructure.Configurations
{
    public class SchoolEntityConfiguration : BaseEntityConfiguration<SchoolEntity>
    {
        public override void Configure(EntityTypeBuilder<SchoolEntity> builder)
        {
            builder.Property(s => s.name).HasMaxLength(30);
            builder.Property(s => s.address).HasMaxLength(30);
            builder.Property(s => s.email).HasMaxLength(50);
            builder.Property(s => s.website).HasMaxLength(100);
            builder.Property(s => s.theme).HasMaxLength(20);
            builder.HasOne(s => s.city).WithMany(c => c.schools).HasForeignKey(s => s.cityId);
        }
    }
}