using backend.Modules.FleetManagement.Domain.Entities;
using backend.Shared.Infrastructure.Configuration;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace backend.Modules.FleetManagement.Infrastructure.Configurations
{
    public class LineModelConfiguration : BaseEntityConfiguration<LineModel>
    {
        public override void Configure(EntityTypeBuilder<LineModel> builder)
        {
            builder.Property(lm => lm.plate).HasMaxLength(15);
            builder.HasOne(lm => lm.line).WithMany(l => l.lineModel).HasForeignKey(lm => lm.lineId);
            builder.HasOne(lm => lm.Year).WithMany(m => m.lineModel).HasForeignKey(lm => lm.modelId);
        }
    }
}