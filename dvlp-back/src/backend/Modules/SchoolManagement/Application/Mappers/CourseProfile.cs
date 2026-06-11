using AutoMapper;
using backend.Modules.SchoolManagement.Application.DTOs.Request;
using backend.Modules.SchoolManagement.Application.DTOs.Response;
using backend.Modules.SchoolManagement.Domain.Entities;

namespace backend.Modules.SchoolManagement.Application.Mappers;

public class CourseProfile : Profile
{
    public CourseProfile()
    {
        CreateMap<Course, CourseResponseDto>();
        CreateMap<CourseRequestDto, Course>();
    }
}