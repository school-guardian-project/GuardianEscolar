using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using FamilyEntity = backend.Modules.UserManagement.Domain.Entities.Family;

namespace backend.Modules.UserManagement.Infrastructure.Configurations
{
    public class FamilyConfiguration : IEntityTypeConfiguration<FamilyEntity>
    {
        public void Configure(EntityTypeBuilder<FamilyEntity> builder)
        {
            builder.Property(f => f.name).HasMaxLength(50);
            builder.Property(f => f.observations).HasMaxLength(100);
        }
    }
}