namespace Books.Application.Interfaces.Helpers;

public interface IHashHelper
{
    string Hash(string password);
    bool IsValidPassword(string password, string hash);
}
