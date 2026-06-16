using backend.Domain.Entities.Users;
using backend.Domain.Entities.Security;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace backend.Infrastructure.Persistence.Configuration.Users
{
    public class ProfileRoleConfiguration : IEntityTypeConfiguration<ProfileRole>
    {
        public void Configure(EntityTypeBuilder<ProfileRole> builder)
        {
            builder.HasKey(pr => pr.Id);
            builder.HasOne(pr => pr.profile).WithMany(p => p.profileRoles).HasForeignKey(pr => pr.profileId);
            builder.HasOne(pr => pr.role).WithMany(p => p.profileRoles).HasForeignKey(pr => pr.roleId);
        }
    }
}