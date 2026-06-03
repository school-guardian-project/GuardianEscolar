using backend.Modules.FleetManagement.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace backend.Modules.FleetManagement.Infrastructure.Configurations
{
    public class LineConfiguration : IEntityTypeConfiguration<Line>
    {
        public void Configure(EntityTypeBuilder<Line> builder)
        {
            builder.HasKey(l => l.lineId);
            builder.Property(l => l.name).HasMaxLength(255);
            builder.HasOne(l => l.brand).WithMany(b => b.line).HasForeignKey(l => l.brandId);
        }
    }
}