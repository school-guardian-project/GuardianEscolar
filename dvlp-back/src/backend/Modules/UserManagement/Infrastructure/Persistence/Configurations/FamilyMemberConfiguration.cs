using backend.Modules.UserManagement.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace backend.Modules.UserManagement.Infrastructure.Persistence.Configurations
{
    public class FamilyMemberConfiguration : IEntityTypeConfiguration<FamilyMember>
    {
        public void Configure(EntityTypeBuilder<FamilyMember> builder)
        {
            builder.HasKey(fm => new { fm.FamilyId, fm.ProfileId });
            builder.HasOne(fm => fm.Family).WithMany(f => f.members).HasForeignKey(fm => fm.FamilyId);
            builder.HasOne(fm => fm.Profile).WithMany(p => p.members).HasForeignKey(fm => fm.ProfileId);
        }
    }
}