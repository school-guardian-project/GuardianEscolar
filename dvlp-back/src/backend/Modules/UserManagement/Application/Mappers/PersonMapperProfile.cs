using AutoMapper;
using backend.Modules.UserManagement.Application.DTOs.Request;
using backend.Modules.UserManagement.Application.DTOs.Response;
using backend.Modules.UserManagement.Domain.Entities;

namespace backend.Modules.UserManagement.Application.Mappers;

public class PersonMapperProfile : Profile
{
    public PersonMapperProfile()
    {
        CreateMap<Person, PersonResponseDto>();
        CreateMap<PersonRequestDto, Person>().ForMember(dest => dest.id, opt => opt.Ignore());
    }
}