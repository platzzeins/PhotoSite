using Microsoft.EntityFrameworkCore;

namespace Kursovaya;

[Keyless]
public record Post
{
    public required int id { get; set; }
    public required string Name { get; set; }
    public required string Author { get; set; }
    public required string Genre { get; set; }
    public required string PhotoUrl { get; set; }
}