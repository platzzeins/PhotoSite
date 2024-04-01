import "./Window.css";
import "../Card/Card.css";
import React, { useState } from "react";
import photoSample from '.././kharkov_tree.jpg';
import { AddPost} from "../APIHandler";


const ModalWindow = ({active, setActive}) => {
    const [photo, setPhotoURL] = useState(""); // Фото поста
    const [name, setName] = useState(""); // Ім'я поста
    const [author, setAuthor] = useState(""); // Автор поста
    const [genre, setGenre] = useState(""); // Жанр поста
    
    const handlePhotoChange = (event) => {
        const file = event.target.files[0]; // Отримання першого вибраного файлу
        const reader = new FileReader(); // Створення нового об'єкту FileReader

        reader.onloadend = () => { // Встановлення обробника завершення читання файла
            setPhotoURL(reader.result); // Встановлення URL фотографії на основі результату читання
        };

        if (file) {
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault(); // Зупиняємо стандартну дію події, щоб уникнути перезавантаження сторінки
    
        const formData = new FormData(event.target); // Створюємо об'єкт FormData на основі цільового елементу форми
        
        AddPost(formData); // Викликаємо функцію AddPost(APIHandler) і передаємо об'єкт formData
    };

    return (
        // Зовнішній контейнер модального вікна, який призупиняє його відображення при кліці за межами модального вікна
        <div className={active ? "modal active" : "modal"} onClick={() => setActive(false)}>
            {/* Вміст модального вікна, який припиняє його закриття при кліці всередині */}
            <div className="modal__content" onClick={e => e.stopPropagation()}>
                {/* Форма для додавання нового поста */}
                <form className="form-container" onSubmit={handleSubmit} encType="multipart/form-data">
                    {/* Контейнер для фотографії та інформації про неї */}
                    <div className="photo-card">
                        {/* Умова для відображення фотографії або зразка, якщо фотографія відсутня */}
                        {photo ? (
                            <div className="image-box">
                                <img className="image" src={photo} alt="Photo"/>
                            </div>
                        ) : (
                            <div className="image-box">
                                <img className="image" src={photoSample} alt="Photo"/>
                            </div>
                        )}
                        {/* Введення назви фотографії та вибір файлу */}
                        <div className="text">
                            <div className="upper-text">
                                <p className="name">|| <input
                                    type="text" 
                                    id="name" 
                                    name="name" 
                                    maxLength={20} 
                                    onChange={(event) => setName(event.target.value)} 
                                    placeholder="Name" 
                                    required/></p>
                                <p><input
                                    className="upload-file"
                                    name="file" 
                                    type="file" 
                                    onChange={handlePhotoChange} 
                                    required
                                /></p>
                            </div>
                            {/* Введення автора та жанру фотографії */}
                            <div className="bottom-text">
                                <p className="author">|| <input 
                                    type="text" 
                                    id="author" 
                                    name="author" 
                                    onChange={(event) => setAuthor(event.target.value)} 
                                    placeholder="Author" 
                                    required/></p>
                                <p className="genre"> <input 
                                    type="text" 
                                    id="genre" 
                                    name="genre" 
                                    onChange={(event) => setGenre(event.target.value)} 
                                    placeholder="Genre" 
                                    required/>||</p>
                            </div>
                        </div>
                    </div>
                    {/* Кнопка відправлення форми */}
                    <div className="button-container">
                        {/* Умова для активації кнопки відправлення лише після введення всіх даних */}
                        {photo && name && author && genre ? (
                            <input 
                                id="submit" 
                                type="submit" 
                                value="Send" 
                                onClick={() => setActive(false)}/>
                        ) : (
                            <p className="submit-message" >Enter all data first</p>
                        )}  
                    </div>
                </form>
            </div>
        </div>
    )
    
}

export default ModalWindow; 