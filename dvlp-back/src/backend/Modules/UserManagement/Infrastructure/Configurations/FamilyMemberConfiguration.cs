using backend.Modules.UserManagement.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace backend.Modules.UserManagement.Infrastructure.Configurations
{
    public class FamilyMemberConfiguration : IEntityTypeConfiguration<FamilyMember>
    {
        public void Configure(EntityTypeBuilder<FamilyMember> builder)
        {
            builder.HasKey(fm => fm.familyMemberId);
            builder.HasOne(fm => fm.family).WithMany(f => f.members).HasForeignKey(fm => fm.familyId);
            builder.HasOne(fm => fm.profile).WithMany(p => p.members).HasForeignKey(fm => fm.profileId);
        }
    }
}