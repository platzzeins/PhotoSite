import React, { useState } from "react";
import photoSample from './kharkov_tree.jpg';
import { AddPost } from "../APIHandler";

const CardForm = () => {
    const [photo, setPhotoURL] = useState("");
    const [name, setName] = useState("");
    const [author, setAuthor] = useState("");
    const [genre, setGenre] = useState("");
    
    const handlePhotoChange = (event) => {
        const file = event.target.files[0];
        const reader = new FileReader();

        reader.onloadend = () => {
            setPhotoURL(reader.result);
        };

        if (file) {
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
    
        const formData = new FormData(event.target);
    
        AddPost(formData);
    };

    return (
        <form className="form-container" onSubmit={handleSubmit} encType="multipart/form-data">
            <div className="photo-card">
                {photo ? (
                    <div className="image-box">
                        <img className="image" src={photo} alt="Photo"/>
                    </div>
                ) : (
                    <div className="image-box">
                        <img className="image" src={photoSample} alt="Photo"/>
                    </div>
                )}
                
                <div className="text">
                    <div className="upper-text">
                    <p className="name">|| <input type="text" id="name" name="name" maxLength={20} onChange={(event) => setName(event.target.value)} placeholder="Photo name" required/></p>
                        <p><input className="upload-file" name="file" type="file" onChange={handlePhotoChange} required/></p>
                    </div>
                    <div className="bottom-text">
                    <p className="author">|| <input type="text" id="author" name="author" onChange={(event) => setAuthor(event.target.value)} placeholder="Author" required/></p>
                    <p className="genre"> <input type="text" id="genre" name="genre" onChange={(event) => setGenre(event.target.value)} placeholder="Genre" required/>||</p>
                    </div>
                </div>
            </div>
            <div className="button-container">
            {photo && name && author && genre ? (
                <input id="submit" type="submit" value="Send"/>
            ) : (
                <p className="submit-message" >Enter all data first</p>
            )}      
            </div>
        </form>
    );
};

export default CardForm;
