using backend.Modules.SchoolManagement.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace backend.Modules.SchoolManagement.Infrastructure.Configurations
{
    public class CityConfiguration : IEntityTypeConfiguration<City>
    {
        public void Configure(EntityTypeBuilder<City> builder)
        {
            builder.HasKey(c => c.Id);
            builder.Property(c => c.name).HasMaxLength(255);
            builder.Property(c => c.country).HasMaxLength(255);
            builder.HasMany(c => c.schools).WithOne(s => s.city).HasForeignKey(s => s.cityId);
        }
    }
}