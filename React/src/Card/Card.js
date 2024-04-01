import React from "react";
import './Card.css';

export default ({item}) => (
    <div className="photo-card"> {/* Контейнер для карточки фотографії */}
        <div className="image-box"> {/* Контейнер для зображення */}
            <img className="image" src={`http://localhost:5242/images/${item.photoUrl}`} alt="Фото"/> {/* Зображення з URL-адресою фото */}
        </div>
        <div className="text"> {/* Контейнер для тексту */}
            <p className="name">|| {item.name}</p> {/* Назва фотографії */}
            <div className="bottom-text"> {/* Контейнер для нижнього тексту */}
                <p className="author">|| {item.author}</p> {/* Автор фотографії */}
                <p className="genre">{item.genre} || </p> {/* Жанр фотографії */}
            </div>
        </div>
    </div>
)