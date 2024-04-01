import React from "react";
import './Header.css'
import Search from "../Search/Search";

export default ({ setModalActive, setItems, setSearchItems }) => (
    <header>
        <Search setItems={setItems} setSearchItems={setSearchItems}></Search>
        <button onClick={() => setModalActive(true)}>Add new photo</button>
    </header>
)
