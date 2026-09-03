using backend.Modules.Security.Domain.Entities;
using backend.Shared.Infrastructure.Configuration;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace backend.Modules.Security.Infrastructure.Configurations
{
    public class ViewActionConfiguration : BaseEntityConfiguration<ViewAction>
    {
        public override void Configure(EntityTypeBuilder<ViewAction> builder)
        {
            builder.HasOne(rm => rm.view).WithMany(v => v.viewActions).HasForeignKey(rm => rm.viewId);
            builder.HasOne(rm => rm.action).WithMany(a => a.viewActions).HasForeignKey(rm => rm.actionId);
        }
    }
}
