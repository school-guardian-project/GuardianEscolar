using AutoMapper;
using backend.Infrastructure.Persistence.Context;
using backend.Modules.SchoolManagement.Application.Services;
using backend.Modules.Security.Application.Services;
using backend.Modules.UserManagement.Application.DTOs.Request;
using backend.Modules.UserManagement.Application.DTOs.Response;
using backend.Shared.Abstracts;
using Microsoft.EntityFrameworkCore;

namespace backend.Modules.UserManagement.Application.Services;

public class StudentService : IBusinessApplication<StudentRequestDto, StudentResponseDto>
{
    private readonly AppDbContext _context;
    private readonly PersonServiceImpl _personService;
    private readonly ProfileService _profileService;
    private readonly ProfileRoleService _profileRoleService;
    private readonly CourseGroupServiceImpl _courseGroupService;
    private readonly IMapper _mapper;

    public StudentService(AppDbContext context, IMapper mapper, PersonServiceImpl personService, ProfileService profileService, ProfileRoleService profileRoleService, CourseGroupServiceImpl courseGroupService)
    {
        _context = context;
        _personService = personService;
        _profileService = profileService;
        _profileRoleService = profileRoleService;
        _courseGroupService = courseGroupService;
        _mapper = mapper;
    }

    public async Task<StudentResponseDto> Create(StudentRequestDto dto)
    {
        using var transction = await _context.Database.BeginTransactionAsync();

        try
        {
            if (string.IsNullOrEmpty(dto.password))
            {
                throw new ArgumentNullException(nameof(dto.password), "La contraseña es requerida.");
            }

            if (dto.courseId == Guid.Empty)
            {
                throw new ArgumentNullException(nameof(dto.courseId), "El curso es requerido.");
            }

            bool courseExists = await _context.Course
                .AsNoTracking()
                .AnyAsync(c => c.id == dto.courseId);

            if (!courseExists)
            {
                throw new ArgumentException("El curso seleccionado no existe.");
            }

            var person = _personService.Create(dto);

            var profile = _profileService.Create(person.id, dto.password);

            var role = await _context.Role.AsNoTracking().FirstOrDefaultAsync(r => r.name == "student");
            if (role == null) throw new Exception("Not Found");
            _profileRoleService.Assign(profile.id, role.id);
            
            Console.WriteLine($"dto.courseId: {dto.courseId}");
            // Console.WriteLine($"courseId obtenido de la BD: {courseId}");

            _courseGroupService.AssignStudent(profile.id, dto.courseId);

            await _context.SaveChangesAsync();

            await transction.CommitAsync();

			Console.WriteLine("Commit realizado");

            return new StudentResponseDto
			{
    			name = person.name,
    			lastName = person.lastName,
    			identificationNumber = person.identificationNumber,
    			phone = person.phone,
    			courseName = ""
			};

			Console.WriteLine("Mapper realizado");
        }
        catch
        {
            await transction.RollbackAsync();
            throw;
        }
    }

    public async Task<List<StudentResponseDto>> FindAll()
    {
        return await _context.Profile
            .AsNoTracking()
            .Where(p => p.status == "active")
            .Where(p => p.profileRoles.Any(r => r.role.name == "student"))
            .Select(p => new StudentResponseDto
        {
            name = p.person.name,
            lastName = p.person.lastName,
            phone = p.person.phone,
            identificationNumber = p.person.identificationNumber,
            
            courseName = p.courseGroups
                .Select(c => c.course.name)
                .FirstOrDefault()
        }).ToListAsync();
    }
}