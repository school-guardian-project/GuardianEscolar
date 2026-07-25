using backend.Modules.UserManagement.Domain.Entities;
using backend.Shared.Infrastructure.Configuration;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace backend.Modules.UserManagement.Infrastructure.Configurations
{
    public class DriverLicenseConfiguration : BaseEntityConfiguration<DriverLicense>
    {
        public override void Configure(EntityTypeBuilder<DriverLicense> builder)
        {
            builder.Property(dl => dl.licenseNumber).HasMaxLength(20);
            builder.Property(dl => dl.licenseExpirationDate).IsRequired();
            builder.HasOne(dl => dl.profile).WithMany(p => p.driverLicenses).HasForeignKey(dl => dl.profileId);
        }
    }
}