using backend.Modules.FleetManagement.Domain.Entities;
using backend.Shared.Infrastructure.Configuration;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace backend.Modules.FleetManagement.Infrastructure.Configurations
{
    public class YearConfiguration : BaseEntityConfiguration<Year>
    {
        public override void Configure(EntityTypeBuilder<Year> builder)
        {
            builder.Property(m => m.year);
        }
    }
}