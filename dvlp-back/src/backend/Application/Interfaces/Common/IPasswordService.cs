namespace backend.Application.Interfaces.Common
{
    public interface IPasswordService
    {
        String Hash(String password);

        bool Verify(String hash, String password);
    }
}
