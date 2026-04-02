using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
namespace GameStore.Domain.Entities;

public class User
{
    public int Id { get; set; } 
    public string Nickname { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty;
    public string? AvatarUrl { get; set; }
    public int UserLevel { get; set; }
    public decimal Balance { get; set; }
    public DateTime CreatedAt { get; set; }
}