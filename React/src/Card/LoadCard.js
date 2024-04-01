import React from "react";
import loadPhoto from "./Load.png";
import './Card.css';

export default ({GetMorePosts}) => (
    <div className="photo-card loader-card" onClick={GetMorePosts}> {/* Картка для завантаження додаткових фотографій, яка викликає функцію GetMorePosts */}
        <div className="load">
            <img src={loadPhoto} alt="Loader"/> {/* Зображення завантажувача */}
            <p>Load more photo</p>
        </div>
    </div>
)