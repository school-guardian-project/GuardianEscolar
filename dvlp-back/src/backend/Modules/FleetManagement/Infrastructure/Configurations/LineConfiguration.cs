using backend.Modules.FleetManagement.Domain.Entities;
using backend.Shared.Infrastructure.Configuration;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace backend.Modules.FleetManagement.Infrastructure.Configurations
{
    public class LineConfiguration : BaseEntityConfiguration<Line>
    {
        public override void Configure(EntityTypeBuilder<Line> builder)
        {
            builder.Property(l => l.name).HasMaxLength(30);
            builder.HasOne(l => l.brand).WithMany(b => b.line).HasForeignKey(l => l.brandId);
        }
    }
}