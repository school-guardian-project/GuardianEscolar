using backend.Modules.RouteManagement.Domain.Entities;
using backend.Shared.Infrastructure.Configuration;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;


namespace backend.Modules.RouteManagement.Infrastructure.Configurations
{
    public class RouteConfiguration : BaseEntityConfiguration<RouteEntity>
    {
        public override void Configure(EntityTypeBuilder<RouteEntity> builder)
        {
            builder.Property(r => r.name).HasMaxLength(30);
            builder.Property(r => r.targetSector).HasMaxLength(30);
            builder.Property(r => r.starDatetTime).HasDefaultValueSql("NOW()");
            builder.Property(r => r.endDateTime).HasDefaultValueSql("NOW()");
            builder.HasOne(r => r.school).WithMany(s => s.routes).HasForeignKey(r => r.schoolId);
        }
    }
}