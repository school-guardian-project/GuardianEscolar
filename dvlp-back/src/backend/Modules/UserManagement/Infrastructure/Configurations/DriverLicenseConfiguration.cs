using backend.Modules.UserManagement.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace backend.Modules.UserManagement.Infrastructure.Configurations
{
    public class DriverLicenseConfiguration : IEntityTypeConfiguration<DriverLicense>
    {
        public void Configure(EntityTypeBuilder<DriverLicense> builder)
        {
            builder.Property(dl => dl.licenseNumber).HasMaxLength(20);
            builder.Property(dl => dl.licenseExpirationDate).IsRequired();
            builder.HasOne(dl => dl.profile).WithMany(p => p.driverLicenses).HasForeignKey(dl => dl.profileId);
        }
    }
}