using AutoMapper;
using backend.Modules.BoardingManagement.Application.DTOs.Request;
using backend.Modules.BoardingManagement.Application.DTOs.Response;
using backend.Modules.BoardingManagement.Domain.Entities;

namespace backend.Modules.BoardingManagement.Application.Mappers;

public class BoardingProfile : Profile
{
    public BoardingProfile()
    {
        CreateMap<Boarding, BoardingResponseDto>();
        CreateMap<BoardingRequestDto, Boarding>();
    }
}