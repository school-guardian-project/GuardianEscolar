using backend.Modules.UserManagement.Domain.Entities;
using backend.Shared.Infrastructure.Configuration;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace backend.Modules.UserManagement.Infrastructure.Configurations
{
    public class FamilyMemberConfiguration : BaseEntityConfiguration<FamilyMember>
    {
        public override void Configure(EntityTypeBuilder<FamilyMember> builder)
        {
            builder.HasOne(fm => fm.family).WithMany(f => f.members).HasForeignKey(fm => fm.familyId);
            builder.HasOne(fm => fm.profile).WithMany(p => p.members).HasForeignKey(fm => fm.profileId);
        }
    }
}