using backend.Modules.Security.Domain.Entities;
using backend.Shared.Infrastructure.Configuration;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace backend.Modules.Security.Infrastructure.Configurations
{
    public class RoleModuleConfiguration : BaseEntityConfiguration<RoleModule>
    {
        public override void Configure(EntityTypeBuilder<RoleModule> builder)
        {
            builder.HasOne(rm => rm.role).WithMany(r => r.roleModules).HasForeignKey(rm => rm.roleId);
            builder.HasOne(rm => rm.module).WithMany(m => m.roleModules).HasForeignKey(rm => rm.moduleId);
        }
    }
}