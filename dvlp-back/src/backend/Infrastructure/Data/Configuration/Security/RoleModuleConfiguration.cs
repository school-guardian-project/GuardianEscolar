using backend.Model.Entities.Security;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace backend.Infrastructure.Persistence.Configuration.Security
{
    public class RoleModuleConfiguration : IEntityTypeConfiguration<RoleModule>
    {
        public void Configure(EntityTypeBuilder<RoleModule> builder)
        {
            builder.HasKey(rm => rm.Id);
            builder.HasOne(rm => rm.Role).WithMany(r => r.roleModules).HasForeignKey(rm => rm.roleId);
            builder.HasOne(rm => rm.Module).WithMany(m => m.roleModules).HasForeignKey(rm => rm.moduleId);
        }
    }
}