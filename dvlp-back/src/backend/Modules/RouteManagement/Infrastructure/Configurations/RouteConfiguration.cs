using backend.Modules.RouteManagement.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;


namespace backend.Modules.RouteManagement.Infrastructure.Configurations
{
    public class RouteConfiguration : IEntityTypeConfiguration<RouteEntity>
    {
        public void Configure(EntityTypeBuilder<RouteEntity> builder)
        {
            builder.HasKey(r => r.routeEntityId);
            builder.Property(r => r.Name).HasMaxLength(255);
            builder.Property(r => r.TargetSector).HasMaxLength(255);
            builder.Property(r => r.StartTime).IsRequired();
            builder.Property(r => r.EndTime).IsRequired();
            builder.HasOne(r => r.school).WithMany(s => s.routes).HasForeignKey(r => r.schoolId);
        }
    }
}