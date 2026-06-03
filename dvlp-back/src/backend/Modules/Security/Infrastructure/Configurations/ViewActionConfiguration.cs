using backend.Modules.Security.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace backend.Modules.Security.Infrastructure.Configurations
{
    public class ViewActionConfiguration : IEntityTypeConfiguration<ViewAction>
    {
        public void Configure(EntityTypeBuilder<ViewAction> builder)
        {
            builder.HasKey(rm => rm.viewActionId);
            builder.HasOne(rm => rm.view).WithMany(v => v.viewActions).HasForeignKey(rm => rm.viewId);
            builder.HasOne(rm => rm.action).WithMany(a => a.viewActions).HasForeignKey(rm => rm.actionId);
        }
    }
}
