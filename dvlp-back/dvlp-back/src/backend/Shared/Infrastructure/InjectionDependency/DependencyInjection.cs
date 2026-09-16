using backend.Modules.AlertManagement.Application.DTOs.Request;
using backend.Modules.AlertManagement.Application.DTOs.Response;
using backend.Modules.AlertManagement.Application.Services;
using backend.Modules.BoardingManagement.Application.DTOs.Request;
using backend.Modules.BoardingManagement.Application.DTOs.Response;
using backend.Modules.BoardingManagement.Application.Services;
using backend.Modules.FleetManagement.Application.DTOs.Request;
using backend.Modules.FleetManagement.Application.DTOs.Response;
using backend.Modules.FleetManagement.Application.Services;
using backend.Modules.RouteManagement.Application.DTOs.Request;
using backend.Modules.RouteManagement.Application.DTOs.Response;
using backend.Modules.RouteManagement.Application.Services;
using backend.Modules.SchoolManagement.Application.DTOs.Request;
using backend.Modules.SchoolManagement.Application.DTOs.Response;
using backend.Modules.SchoolManagement.Application.Services;
using backend.Modules.Security.Application.Services;
using backend.Modules.Security.Domain.Interfaces;
using backend.Modules.UserManagement.Application.DTOs.Request;
using backend.Modules.UserManagement.Application.DTOs.Response;
using backend.Modules.UserManagement.Application.Services;
using backend.Shared.Interfaces;

namespace backend.Shared.Infrastructure.InjectionDependency;

public static class DependencyInjection
{
    public static void AddApplicationServices( this IServiceCollection services)
    {
        services.AddScoped<ICrudService<AlertResponseDto, AlertRequestDto, Guid>, AlertServiceImpl>();
        services.AddScoped<ICrudService<SavedAlertsResponseDto, SavedAlertsRequestDto, Guid>, SavedAlertsServiceImpl>();
        services.AddScoped<ICrudService<BoardingResponseDto, BoardingRequestDto, Guid>, BoardingServiceImpl>();
        services.AddScoped<ICrudService<BusResponseDto, BusRequestDto, Guid>, BusServiceImpl>();
        services.AddScoped<ICrudService<ExceptionalDriverResponseDto, ExceptionalDriverUsageRequestDto, Guid>, ExceptionalDriverUsageServiceImpl>();
        services.AddScoped<ICrudService<LineModelResponseDto, LIneModelRequestDto, Guid>, LineModelServiceImpl>();
        services.AddScoped<ICrudService<AlertResponseDto, AlertRequestDto, Guid>, AlertServiceImpl>();
        services.AddScoped<ICrudService<ExceptionalRouteUsageResponseDto, ExceptionalRouteUsageRequestDto, Guid>, ExceptionalRouteUsageServiceImpl>();
        services.AddScoped<ICrudService<RouteBusAssignmentsResponseDto, RouteBusAssignmentsRequestDto, Guid>, RouteBusAssignmentsServiceImpl>();
        services.AddScoped<ICrudService<RouteEntityResponseDto, RouteEntityRequestDto, Guid>, RouteEntityServiceImpl>();
        services.AddScoped<ICrudService<RouteStopResponseDto, RouteStopRequestDto, Guid>, RouteStopServiceImpl>();
        services.AddScoped<ICrudService<RouteStudentAssignmentsResponseDto, RouteStudentAssignmentsRequestDto, Guid>, RouteStudentAssignmentsServiceImpl>();
        services.AddScoped<ICrudService<StopResponseDto, StopRequestDto, Guid>, StopServiceImpl>();
        services.AddScoped<ICrudService<CourseGroupResponseDto, CourseGroupRequestDto, Guid>, CourseGroupServiceImpl>();
        services.AddScoped<ICrudService<CourseResponseDto, CourseRequestDto, Guid>, CourseServiceImpl>();
        services.AddScoped<ICrudService<SchoolCampuseResponseDto, SchoolCampuseRequestDto, Guid>, SchoolCampuseServiceImpl>();
        services.AddScoped<ICrudService<SchoolResponseDto, SchoolRequestDto, Guid>, SchoolServiceImpl>();
        services.AddScoped<ICrudService<DriverLicenseResponseDto, DriverLicenseRequestDto, Guid>, DriverLicenseServiceImpl>();
        services.AddScoped<ICrudService<FamilyMemberResponseDto, FamilyMemberRequestDto, Guid>, FamilyMemberServiceImpl>();
        services.AddScoped<ICrudService<FamilyResponseDto, FamilyRequestDto, Guid>, FamilyServiceImpl>();
        services.AddScoped<ICrudService<PersonResponseDto, PersonRequestDto, Guid>, PersonServiceImpl>();

        services.AddScoped<IAuthService, AuthService>();
        services.AddScoped<IJwtService, JwtService>();
        services.AddScoped<IPasswordService, PasswordService>();
    }
}