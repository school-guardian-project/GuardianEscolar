using backend.Modules.SchoolManagement.Domain.Entities;
using backend.Shared.Infrastructure.Configuration;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace backend.Modules.SchoolManagement.Infrastructure.Configurations
{
    public class CityConfiguration : BaseEntityConfiguration<City>
    {
        public override void Configure(EntityTypeBuilder<City> builder)
        {
            builder.Property(c => c.name).HasMaxLength(40);
            builder.Property(c => c.country).HasMaxLength(30);
            builder.HasMany(c => c.schools).WithOne(s => s.city).HasForeignKey(s => s.cityId);
        }
    }
}