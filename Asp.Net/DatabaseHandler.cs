using Npgsql;

namespace Kursovaya;

public class DatabaseHandler
{
    // Рядок підключення до бази даних PostgreSQL
    private const string ConnectionString = "Host=localhost;Port=5432;Database=kursovaya;Username=platzz;Password=pass1234";

    // Створення джерела даних NpgsqlDataSource за допомогою рядка підключення
    private static readonly NpgsqlDataSource DataSource = NpgsqlDataSource.Create(ConnectionString);

    // Метод для додавання нового поста до бази даних
    public async void AddPost(string name, string author, string genre, string fileName)
    {
        // Встановлення з'єднання з базою даних
        await using var conn = DataSource.CreateConnection();
        await conn.OpenAsync(); // Відкриття з'єднання

        // Створення команди SQL для вставки даних в таблицю "posts"
        await using var cmd = new NpgsqlCommand("INSERT INTO posts (name, author, genre, photoURL) VALUES (@name, @author, @genre, @photoURL)", conn);

        // Додавання параметрів до команди для заповнення значень
        cmd.Parameters.AddWithValue("@name", name);
        cmd.Parameters.AddWithValue("@author", author);
        cmd.Parameters.AddWithValue("@genre", genre);
        cmd.Parameters.AddWithValue("@photoURL", fileName);

        // Виконання SQL-команди для вставки даних із параметрами
        await cmd.ExecuteNonQueryAsync();
    }
    
    public static async Task<List<Post>> GetPosts(int quantity, int offset)
    {
        var posts = new List<Post>(); // Створення списку для збереження постів
    
        await using var conn = DataSource.CreateConnection(); // Створення з'єднання з базою даних
        await conn.OpenAsync(); // Відкриття з'єднання
    
        await using var cmd = new NpgsqlCommand("SELECT id, name, author, genre, photoURL FROM posts OFFSET @offset LIMIT @quantity", conn); // Створення команди SQL для отримання постів
    
        cmd.Parameters.AddWithValue("@offset", offset); // Додавання параметра зміщення
        cmd.Parameters.AddWithValue("@quantity", quantity); // Додавання параметра кількості
    
        await using var reader = await cmd.ExecuteReaderAsync(); // Виконання команди та отримання читача результатів
        while (await reader.ReadAsync()) // Читання результатів по одному рядку за раз
        {
            var id = reader.GetInt16(0); // Отримання ID поста
            var name = reader.GetString(1); // Отримання назви поста
            var author = reader.GetString(2); // Отримання автора поста
            var genre = reader.GetString(3); // Отримання жанру поста
            var photoUrl = reader.GetString(4); // Отримання URL фото поста
        
            posts.Add(new Post(){id = id, Name = name, Author = author, Genre = genre, PhotoUrl = photoUrl}); // Додавання нового поста до списку
        }

        foreach (var post in posts) // Ітерація по списку постів
        {
            Console.WriteLine(post.PhotoUrl); // Виведення URL фото кожного поста в консоль
        }
    
        return posts; // Повернення списку постів
    }

    public async Task<List<Post>> GetPostsViaFind(Func<Post, string> getField, string searchRequest)
    {
        var posts = new List<Post>(); // Створення списку для збереження постів

        await using var conn = DataSource.CreateConnection(); // Створення з'єднання з базою даних
        await conn.OpenAsync(); // Відкриття з'єднання

        await using var cmd = new NpgsqlCommand($"SELECT id, name, author, genre, photoURL FROM posts ", conn); // Створення команди SQL для отримання постів

        await using var reader = await cmd.ExecuteReaderAsync(); // Виконання команди та отримання читача результатів
        while (await reader.ReadAsync()) // Читання результатів по одному рядку за раз
        {
            var id = reader.GetInt16(0); // Отримання ID поста
            var name = reader.GetString(1); // Отримання назви поста
            var author = reader.GetString(2); // Отримання автора поста
            var genre = reader.GetString(3); // Отримання жанру поста
            var photoUrl = reader.GetString(4); // Отримання URL фото поста

            posts.Add(new Post{id = id, Name = name, Author = author, Genre = genre, PhotoUrl = photoUrl}); // Додавання нового поста до списку
        }

        var postsSorted = new List<Post>(); // Створення відсортованого списку постів

        while (!string.IsNullOrEmpty(searchRequest)) // Поки пошуковий запит не порожній
        {
            var foundPosts = new List<Post>(); // Створення списку для збереження знайдених постів
            for (var i = posts.Count - 1; i >= 0; i--) // Ітерація з кінця списку постів
            {
                var post = posts[i]; // Отримання поста зі списку
                if (!getField(post).Contains(searchRequest)) continue; // Перевірка, чи містить поле вказане значення
                foundPosts.Add(post); // Додавання знайденого поста до списку
                posts.RemoveAt(i); // Видалення знайденого поста з основного списку
            }
            searchRequest = searchRequest.Substring(0, searchRequest.Length - 1); // Зменшення розміру пошукового запиту
            postsSorted.AddRange(foundPosts); // Додавання знайдених постів до відсортованого списку
        }

        postsSorted.AddRange(posts); // Додавання решти постів до відсортованого списку

        foreach (var post in postsSorted) // Ітерація по відсортованому списку постів
        {
            Console.WriteLine($"Name: {post.Name} id: {post.Genre}"); // Виведення інформації про пост у консоль
        }

        return postsSorted; // Повернення відсортованого списку постів
    }

}