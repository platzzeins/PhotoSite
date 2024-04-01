import React, { useState } from "react";
import './Search.css';
import { GetPostsBySearch } from "../APIHandler";

const Search = ({ setItems, setSearchItems }) => {
    const [searchRequest, setSearchRequest] = useState(); // Запит пошуку
    const [searchType, setSearchType] = useState('name'); // Типу пошуку, за замовчуванням - за назвою

    const handleSubmit = async (event) => {
        event.preventDefault(); // Зупинка стандартної події форми

        // Виклик функції GetPostsBySearch для отримання результатів пошуку та оновлення стану елементів
        GetPostsBySearch(searchRequest, searchType)
            .then(data => setItems(data)) // Оновлення стану елементів
            .then((status) => setSearchItems(status)); // Оновлення статусу пошуку
    };

    const handleRequestChange = (event) => {
        setSearchRequest(event.target.value); // Оновлення стану searchRequest за зміною значення поля введення
    };

    const handleRadioChange = (event) => {
        setSearchType(event.target.value); // Оновлення стану searchType за зміною значення радіокнопки
    };

    return (
        // Зовнішній контейнер для пошукової форми
        <div className="searchBox">
            {/* Форма пошуку, що викликає handleSubmit при поданні */}
            <form onSubmit={handleSubmit}>
                {/* Контейнер для поля введення пошукового запиту */}
                <div className="searchRequest">
                    {/* Поле введення, яке викликає handleRequestChange за зміною */}
                    <input type="text" name="searchRequest" onInput={handleRequestChange} placeholder="Search" required/>
                </div>
                {/* Контейнер для радіокнопок вибору типу пошуку */}
                <div className="searchType">
                    {/* Радіокнопка для пошуку за назвою, перевіряється, чи вибрано цей тип пошуку */}
                    <input id="name" name="searchType" type="radio" value="name" onChange={handleRadioChange} checked={searchType === 'name'} required/>
                    <label htmlFor="name" className="searchBox">Name</label>
                    {/* Радіокнопка для пошуку за автором, перевіряється, чи вибрано цей тип пошуку */}
                    <input id="author" name="searchType" type="radio" value="author" onChange={handleRadioChange} checked={searchType === 'author'}/>
                    <label htmlFor="author" className="searchBox">Author</label>
                    {/* Радіокнопка для пошуку за жанром, перевіряється, чи вибрано цей тип пошуку */}
                    <input id="genre" name="searchType" type="radio" value="genre" onChange={handleRadioChange} checked={searchType === 'genre'}/>
                    <label htmlFor="genre" className="searchBox">Genre</label>
                </div>
            </form>
        </div>
    )
}

export default Search;