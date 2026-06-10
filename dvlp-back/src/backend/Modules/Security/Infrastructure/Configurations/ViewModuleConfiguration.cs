using backend.Modules.Security.Domain.Entities;
using backend.Shared.Infrastructure.Configuration;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace backend.Modules.Security.Infrastructure.Configurations
{
    public class ViewModuleConfiguration : BaseEntityConfiguration<ViewModule>
    {
        public override void Configure(EntityTypeBuilder<ViewModule> builder)
        {
            builder.HasOne(vm => vm.view).WithMany(v => v.viewModules).HasForeignKey(vm => vm.viewId);
            builder.HasOne(vm => vm.module).WithMany(m => m.viewModules).HasForeignKey(vm => vm.moduleId);
        }
    }
}