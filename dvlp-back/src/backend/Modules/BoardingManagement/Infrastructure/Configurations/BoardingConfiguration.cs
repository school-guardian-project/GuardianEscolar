using backend.Modules.BoardingManagement.Domain.Entities;
using backend.Shared.Infrastructure.Configuration;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace backend.Modules.BoardingManagement.Infrastructure.Configurations
{
    public class BoardingConfiguration : BaseEntityConfiguration<Boarding>
    {
        public override void Configure(EntityTypeBuilder<Boarding> builder)
        {
            builder.Property(b => b.profileId).IsRequired();
            builder.Property(b => b.stopId).IsRequired();
            builder.Property(b => b.busId).IsRequired();
            builder.Property(b => b.dateTime).HasDefaultValueSql("NOW()").IsRequired();
            builder.Property(b => b.action).IsRequired();
            builder.HasOne(b => b.profile).WithMany(p => p.boardings).HasForeignKey(b => b.profileId);
            builder.HasOne(b => b.bus).WithMany(b => b.boardings).HasForeignKey(b => b.busId);
            builder.HasOne(b => b.stop).WithMany(s => s.boardings).HasForeignKey(b => b.stopId);
        }
    }
}