using backend.Model.Entities.Family;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using FamilyEntity = backend.Model.Entities.Family.Family;

namespace backend.Infrastructure.Persistence.Configuration.Family
{
    public class FamilyConfiguration : IEntityTypeConfiguration<FamilyEntity>
    {
        public void Configure(EntityTypeBuilder<FamilyEntity> builder)
        {
            builder.HasKey(f => f.Id);
            builder.Property(f => f.name).HasMaxLength(255);
            builder.Property(f => f.observations).HasMaxLength(1000);
        }
    }
}