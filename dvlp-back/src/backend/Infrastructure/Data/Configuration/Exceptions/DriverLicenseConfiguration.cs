using backend.Model.Entities.Exceptions;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace backend.Infrastructure.Persistence.Configuration.Exceptions
{
    public class DriverLicenseConfiguration : IEntityTypeConfiguration<DriverLicense>
    {
        public void Configure(EntityTypeBuilder<DriverLicense> builder)
        {
            builder.HasKey(dl => dl.Id);
            builder.Property(dl => dl.licenseNumber).HasMaxLength(255);
            builder.Property(dl => dl.licenseExpirationDate).IsRequired();
            builder.HasOne(dl => dl.profile).WithMany(p => p.driverLicenses).HasForeignKey(dl => dl.profileId);
        }
    }
}