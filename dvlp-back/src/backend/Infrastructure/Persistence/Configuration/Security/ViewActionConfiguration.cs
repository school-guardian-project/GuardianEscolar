using backend.Domain.Entities.Security;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace backend.Infrastructure.Persistence.Configuration.Security
{
    public class ViewActionConfiguration : IEntityTypeConfiguration<ViewAction>
    {
        public void Configure(EntityTypeBuilder<ViewAction> builder)
        {
            builder.HasKey(rm => rm.Id);
            builder.HasOne(rm => rm.view).WithMany(v => v.viewActions).HasForeignKey(rm => rm.viewId);
            builder.HasOne(rm => rm.action).WithMany(a => a.viewActions).HasForeignKey(rm => rm.actionId);
        }
    }
}
