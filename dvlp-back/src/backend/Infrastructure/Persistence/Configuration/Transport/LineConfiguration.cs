using backend.Domain.Entities.Transport;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace backend.Infrastructure.Persistence.Configuration.Transport
{
    public class LineConfiguration : IEntityTypeConfiguration<Line>
    {
        public void Configure(EntityTypeBuilder<Line> builder)
        {
            builder.HasKey(l => new { l.lineId });
            builder.Property(l => l.name).HasMaxLength(255);
            builder.HasOne(l => l.brand).WithMany(b => b.line).HasForeignKey(l => l.brandId);
        }
    }
}