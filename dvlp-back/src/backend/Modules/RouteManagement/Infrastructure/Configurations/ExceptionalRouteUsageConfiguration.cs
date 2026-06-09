using backend.Modules.RouteManagement.Domain.Entities;
using backend.Shared.Infrastructure.Configuration;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace backend.Modules.RouteManagement.Infrastructure.Configurations
{
    public class ExceptionalRouteUsageConfiguration : BaseEntityConfiguration<ExceptionalRouteUsage>
    {
        public override void Configure(EntityTypeBuilder<ExceptionalRouteUsage> builder)
        {
            builder.Property(eru => eru.dateTime).IsRequired();
            builder.Property(eru => eru.reason).HasMaxLength(200);
            builder.HasOne(eru => eru.route).WithMany(r => r.exceptionalRouteUsages).HasForeignKey(eru => eru.routeId);
        }
    }
}