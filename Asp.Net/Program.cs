using Kursovaya;
using Microsoft.AspNetCore.Mvc;

var builder = WebApplication.CreateBuilder(args); // Створення будівника веб-додатка

const string myAllowSpecificOrigins = "_myAllowSpecificOrigins"; // Константа для ідентифікації політики CORS

builder.Services.AddCors(options => // Додавання сервісу CORS
{
    options.AddPolicy(name: myAllowSpecificOrigins, // Додавання політики CORS з іменем myAllowSpecificOrigins
        policy =>
        {
            policy.WithOrigins("http://localhost:3000") // Дозвіл на запити від http://localhost:3000
                .AllowAnyHeader() // Дозвіл на будь-які заголовки
                .AllowAnyMethod(); // Дозвіл на будь-які HTTP-методи
        });
});

var app = builder.Build(); // Побудова додатка

app.UseCors(myAllowSpecificOrigins); // Використання політики CORS

var databaseHandler = new DatabaseHandler(); // Створення обробника бази даних
var imageFolderPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "Images"); // Шлях до теки зображень

app.MapGet("/", () => "API Is Working!"); // Мапування GET-маршруту "/"

app.MapGet("/posts", async (int? quantity, int? offset, string? field, string? searchRequest) => // Мапування GET-маршруту "/posts"
{
    if (string.IsNullOrEmpty(field))
    {
        if (quantity is null || offset is null)
        {
            return Results.BadRequest(); // Повернення результату 400 Bad Request, якщо неправильні параметри запиту
        }
        var posts = await DatabaseHandler.GetPosts(quantity.Value, offset.Value); // Отримання дописів з бази даних
        return Results.Json(posts); // Повернення результату у форматі JSON
    }

    if (string.IsNullOrEmpty(searchRequest))
    {
        return Results.BadRequest(); // Повернення результату 400 Bad Request, якщо неправильний пошуковий запит
    }
    
    switch (field)
    {
        case "name":
            return Results.Json(await databaseHandler.GetPostsViaFind(post => post.Name, searchRequest)); // Повернення результату пошуку за назвою
        case "author":
            return Results.Json(await databaseHandler.GetPostsViaFind(post => post.Author, searchRequest)); // Повернення результату пошуку за автором
        case "genre":
            return Results.Json(await databaseHandler.GetPostsViaFind(post => post.Genre, searchRequest)); // Повернення результату пошуку за жанром
        default:
            return Results.Json("Error"); // Повернення результату помилки, якщо невідомий тип пошуку
    }
});
app.MapPost("/addpost", ([FromForm] string name, [FromForm] string author, [FromForm] string genre, IFormFile file) => // Мапування POST-маршруту "/addpost"
{
    var fileName = Path.GetRandomFileName(); // Генерація випадкового імені файлу
    var path = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "Images", fileName); // Шлях до зображення
    
    using (var fileStream = new FileStream(path, FileMode.Create)) // Використання файлового потоку для збереження зображення
    {
        file.CopyTo(fileStream); // Копіювання файлу в потік
    }
    
    databaseHandler.AddPost(name, author, genre, fileName); // Додавання допису в базу даних
}).DisableAntiforgery(); // Відключення захисту від міжсайтової підробки запитів

app.MapGet("/images/{imageName}", async (string imageName) => // Мапування GET-маршруту для отримання зображень
{
    var imagePath = Path.Combine(imageFolderPath, imageName); // Шлях до зображення
    
    if (!File.Exists(imagePath)) // Перевірка наявності зображення за вказаним шляхом
    {
        return Results.NotFound(); // Повернення результату 404 Not Found, якщо зображення не знайдено
    }

    var fileStream = new FileStream(imagePath, FileMode.Open); // Відкриття файлового потоку для зображення
    return Results.File(fileStream, "image/jpeg"); // Повернення зображення у відповіді
});

app.Run(); // Запуск додатка
