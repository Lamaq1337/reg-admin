import React, { useState } from 'react';

function PhotoUpload() {
    const [file, setFile] = useState(null);
    const [statusMessage, setStatusMessage] = useState("");

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!file) {
            setStatusMessage("Пожалуйста, выберите файл");
            return;
        }

        const formData = new FormData();
        formData.append("photo", file);

        const response = await fetch("http://localhost/reg-admin/my-app/php/uploadPhoto.php", {
            method: "POST",
            body: formData,
        });

        const data = await response.json();
        setStatusMessage(data.message);
        setFile(null); // Сброс файла после загрузки
    };

    return (
        <div style={{ maxWidth: "400px", margin: "auto", padding: "20px", textAlign: "center" }}>
            <h1>Загрузить фотографию</h1>
            {statusMessage && <p>{statusMessage}</p>}
            <form onSubmit={handleSubmit}>
                <input type="file" accept="image/*" onChange={handleFileChange} required />
                <button type="submit" style={{ marginTop: "10px" }}>Отправить</button>
            </form>
        </div>
    );
}

export default PhotoUpload;
