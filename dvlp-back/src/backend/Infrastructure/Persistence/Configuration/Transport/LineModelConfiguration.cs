using backend.Domain.Entities.Transport;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace backend.Infrastructure.Persistence.Configuration.Transport
{
    public class LineModelConfiguration : IEntityTypeConfiguration<LineModel>
    {
        public void Configure(EntityTypeBuilder<LineModel> builder)
        {
            builder.HasKey(lm => new { lm.lineModelId });
            builder.Property(lm => lm.plate).HasMaxLength(255);
            builder.HasOne(lm => lm.line).WithMany(l => l.lineModel).HasForeignKey(lm => lm.lineId);
            builder.HasOne(lm => lm.model).WithMany(m => m.lineModel).HasForeignKey(lm => lm.modelId);
        }
    }
}