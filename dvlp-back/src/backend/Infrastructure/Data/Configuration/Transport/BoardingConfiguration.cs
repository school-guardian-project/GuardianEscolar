using backend.Model.Entities.Transport;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace backend.Infrastructure.Persistence.Configuration.Transport
{
    public class BoardingConfiguration : IEntityTypeConfiguration<Boarding>
    {
        public void Configure(EntityTypeBuilder<Boarding> builder)
        {
            builder.HasKey(b => new { b.profileId, b.busId, b.stopId, b.dateTime });
            builder.Property(b => b.dateTime).IsRequired();
            builder.Property(b => b.action).IsRequired();
            builder.HasOne(b => b.profile).WithMany(p => p.boardings).HasForeignKey(b => b.profileId);
            builder.HasOne(b => b.bus).WithMany(b => b.boardings).HasForeignKey(b => b.busId);
            builder.HasOne(b => b.stop).WithMany(s => s.boardings).HasForeignKey(b => b.stopId);
        }
    }
}