using backend.Domain.Entities.Users;

namespace backend.Application.Interfaces.Common
{
    public interface IJwtService
    {
        String GenerateToken(
            Person person,
            List<String> roles
        );
    }
}
