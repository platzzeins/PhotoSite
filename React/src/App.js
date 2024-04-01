import './App.css';
import './Card/Card.css';
import './General.css'
import Card from './Card/Card';
import Header from './Header/Header';
import ModalWindow from './CreationWindow/ModalWindow';
import {useEffect, useState} from 'react';
import React from 'react';
import {GetPosts} from './APIHandler';
import loadPhoto from "./Card/Load.png";
import LoadCard from './Card/LoadCard';

function App() {
  const [items, setItems] = useState([]); //Масив даних для карток
  const [isSearchItems, setSearchItems] = useState(true); //Чи був здійснений пошук
  const [modalActive, setModalActive] = useState(false); //Відкрите модальне вікно чи ні
  const [newDataLoaded, setNewDataLoaded] = useState(false); //Чи завантажені нові дані для карток
  const loadedPostIds = items.map(item => item.Id); //Ідентифікатори карток
  const [offset, setOffset] = useState(0); //Зміщення кількості карток

  useEffect(() => {
    GetPosts(offset) //Отримуємо дані для перших карток
      .then(data => setItems(data)) //Присвоюємо отимані дані у змінну items
      .catch(error => console.error('Error fetching posts:', error)); //Оброблюємо помилку у разі її виникнення
    }, []);

  const handleLoadMore = () => {
    GetPosts(offset + 2) //Отримуємо дані для подальших карток
      .then(newItems => {
        setItems(prevItems => [...prevItems, ...newItems]); //Присвоюємо отимані дані у змінну об'єднуючи попередні дані та нові
        setNewDataLoaded(true); //Встановлюємо перемикач newDataLoaded у стан true
      })
      .catch(error => console.error('Error fetching more posts:', error)); //Оброблюємо помилку у разі її виникнення
    setOffset((prevOffset) => prevOffset + 2); //Збільшуємо зміщення
  };

  return (
    <>
      <ModalWindow active={modalActive} setActive={setModalActive} /> {/* Модальне вікно з формою для додавання картки */}
      <Header setModalActive={setModalActive} setItems={setItems} setSearchItems={setSearchItems} /> {/* Шапка сайту */}
      <div className="parent-cards">
        <div className='cards'> {/* Блок з картками */}

        {isSearchItems ? ( // Якщо звичайне відображення, а не за пошуком
          <>
            {items.map(item => (
              <Card key={item.id} item={item}/> // Картка
            ))}

            {newDataLoaded && ( // Якщо нові картки додані
              <>
                {items.filter(item => !loadedPostIds.includes(item.Id)).map(item => ( // Нові картки, яких немає в loadedPostIds
                  <Card key={item.id} item={item}/> // Картка
                ))}
              </>
            )}
            <LoadCard GetMorePosts={handleLoadMore}></LoadCard>
          </>
        ) : ( // Якщо був зроблен пошук
          <>
            {items.map(item => (
              <Card key={item.id} item={item}/> // Картка
            ))}
          </>
        )}
        </div>
      </div>
    </>
  );
}

export default App;