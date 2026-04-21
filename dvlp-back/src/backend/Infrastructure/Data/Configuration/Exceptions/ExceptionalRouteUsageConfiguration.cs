using backend.Model.Entities.Exceptions;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace backend.Infrastructure.Persistence.Configuration.Exceptions
{
    public class ExceptionalRouteUsageConfiguration : IEntityTypeConfiguration<ExceptionalRouteUsage>
    {
        public void Configure(EntityTypeBuilder<ExceptionalRouteUsage> builder)
        {
            builder.HasKey(eru => eru.Id);
            builder.Property(eru => eru.dateTime).IsRequired();
            builder.Property(eru => eru.reason).HasMaxLength(500);
            builder.HasOne(eru => eru.route).WithMany(r => r.exceptionalRouteUsages).HasForeignKey(eru => eru.routeId);
        }
    }
}