using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using backend.Modules.Security.Domain.Entities;
using backend.Shared.Infrastructure.Configuration;

namespace backend.Modules.Security.Infrastructure.Configurations
{
    public class ProfileRoleConfiguration : BaseEntityConfiguration<ProfileRole>
    {
        public override void Configure(EntityTypeBuilder<ProfileRole> builder)
        {
            builder.HasOne(pr => pr.profile).WithMany(p => p.profileRoles).HasForeignKey(pr => pr.profileId);
            builder.HasOne(pr => pr.role).WithMany(p => p.profileRoles).HasForeignKey(pr => pr.roleId);
        }
    }
}