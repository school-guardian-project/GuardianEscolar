using AutoMapper;
using backend.Infrastructure.Persistence.Context;
using backend.Modules.UserManagement.Application.DTOs.Request;
using backend.Modules.UserManagement.Application.DTOs.Response;
using backend.Modules.UserManagement.Domain.Entities;
using backend.Shared.Abstracts;

namespace backend.Modules.UserManagement.Application.Services;

public class DriverLicenseServiceImpl : ACrudService<DriverLicense, DriverLicenseResponseDto, DriverLicenseRequestDto>
{
    public DriverLicenseServiceImpl(AppDbContext context, IMapper mapper) : base(context, mapper)
    {
    }

    public override DriverLicenseResponseDto UpdatePartial(Guid id, DriverLicenseRequestDto dto)
    {
        var entity = _context.Set<DriverLicense>().Find(id);
        if (entity is null) throw new Exception("Not found");
        
        if (dto.profileId != Guid.Empty && dto.profileId != entity.profileId) entity.profileId = dto.profileId;
        if (dto.drivingLicense != null && !dto.drivingLicense.SequenceEqual(entity.drivingLicense)) entity.drivingLicense = dto.drivingLicense;
        if (dto.licenseExpirationDate.HasValue && dto.licenseExpirationDate.Value != entity.licenseExpirationDate) entity.licenseExpirationDate = dto.licenseExpirationDate.Value;
        if (!string.IsNullOrEmpty(dto.licenseNumber) && dto.licenseNumber != entity.licenseNumber) entity.licenseNumber = dto.licenseNumber;
        
        _context.SaveChanges();
        return _mapper.Map<DriverLicenseResponseDto>(entity);
    }
}