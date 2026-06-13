using AutoMapper;
using backend.Infrastructure.Persistence.Context;
using backend.Modules.UserManagement.Application.DTOs.Request;
using backend.Modules.UserManagement.Application.DTOs.Response;
using backend.Modules.UserManagement.Domain.Entities;
using backend.Shared.Abstracts;

namespace backend.Modules.UserManagement.Application.Services;

public class PersonServiceImpl : ACrudService<Person, PersonResponseDto, PersonRequestDto>
{
    public PersonServiceImpl(AppDbContext context, IMapper mapper) : base(context, mapper)
    {
    }

    public override PersonResponseDto UpdatePartial(Guid id, PersonRequestDto dto)
    {
        var entity = _context.Set<Person>().Find(id);
        if (entity is null) throw new Exception("Not found");
        
        if (dto.identificationId != Guid.Empty && dto.identificationId != entity.identificationId) entity.identificationId = dto.identificationId;
        if (!string.IsNullOrEmpty(dto.name) && dto.name != entity.name) entity.name = dto.name;
        if (!string.IsNullOrEmpty(dto.lastName) && dto.lastName != entity.lastName) entity.lastName = dto.lastName;
        if (!string.IsNullOrEmpty(dto.email) && dto.email != entity.email) entity.email = dto.email;
        if (!string.IsNullOrEmpty(dto.residenceAddress) && dto.residenceAddress != entity.residenceAddress) entity.residenceAddress = dto.residenceAddress;
        if (dto.phone.HasValue && dto.phone != entity.phone) entity.phone = dto.phone.Value;
        if (!string.IsNullOrEmpty(dto.status) && dto.status != entity.status) entity.status = dto.status;
        
        _context.SaveChanges();
        return _mapper.Map<PersonResponseDto>(entity);
    }
}