using backend.Modules.Security.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace backend.Modules.Security.Infrastructure.Configurations
{
    public class ViewModuleConfiguration : IEntityTypeConfiguration<ViewModule>
    {
        public void Configure(EntityTypeBuilder<ViewModule> builder)
        {
            builder.HasKey(vm => vm.Id);
            builder.HasOne(vm => vm.View).WithMany(v => v.viewModules).HasForeignKey(vm => vm.ViewId);
            builder.HasOne(vm => vm.Module).WithMany(m => m.viewModules).HasForeignKey(vm => vm.ModuleId);
        }
    }
}