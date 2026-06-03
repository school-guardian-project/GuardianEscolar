using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using backend.Modules.Security.Domain.Entities;

namespace backend.Modules.Security.Infrastructure.Configurations
{
    public class ProfileRoleConfiguration : IEntityTypeConfiguration<ProfileRole>
    {
        public void Configure(EntityTypeBuilder<ProfileRole> builder)
        {
            builder.HasKey(pr => pr.profileRoleId);
            builder.HasOne(pr => pr.profile).WithMany(p => p.profileRoles).HasForeignKey(pr => pr.profileId);
            builder.HasOne(pr => pr.role).WithMany(p => p.profileRoles).HasForeignKey(pr => pr.roleId);
        }
    }
}