const quantity = 2; // Кількість карток для запиту

function GetPosts(offset) { // Звичайний запит 
  console.log("getposts");
  return fetch(`http://localhost:5242/posts?quantity=${quantity}&offset=${offset}`)
    .then(response => response.json())
    .catch(error => console.error('Error getting posts:', error));;
}

function GetPostsBySearch(searchRequest, field) { // Запит за пошуком
  return fetch(`http://localhost:5242/posts?searchRequest=${searchRequest}&field=${field}`)
    .then(response => response.json())
    .catch(error => console.error('Error getting posts by search:', error));;
}

function AddPost(formData){ // Додавання нової картки
  try {
    fetch('http://localhost:5242/addpost', {
        method: 'POST',
        body: formData
    });
  } catch (error) {
      console.error('Error:', error);
  }
}
  
export { GetPosts, GetPostsBySearch, AddPost };

