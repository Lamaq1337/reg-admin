import React, { useState } from 'react';

function RegistrationApp() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        username: ""
    });
    const [statusMessage, setStatusMessage] = useState("");

    // Обработчик изменения ввода
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };

    // Регистрация пользователя
    const registerUser = async () => {
        const response = await fetch("http://localhost/reg-admin/my-app/php/registration.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData),
        });
        const data = await response.json();
        setStatusMessage(data.message);
    };

    // Подтверждение или отклонение заявки
    const handleUserRequest = async (userId, action) => {
        const response = await fetch("http://localhost/reg-admin/my-app/php/admin.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ user_id: userId, action: action }),
        });
        const data = await response.json();
        setStatusMessage(data.message);
    };

    return (
        <div style={{ maxWidth: "400px", margin: "auto", padding: "20px", textAlign: "center" }}>
            <h1>Регистрация пользователя</h1>
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    registerUser();
                }}
            >
                <div style={{ marginBottom: "10px" }}>
                    <label>Имя:</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        style={{ width: "100%", padding: "8px" }}
                    />
                </div>
                <div style={{ marginBottom: "10px" }}>
                    <label>Email:</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        style={{ width: "100%", padding: "8px" }}
                    />
                </div>
                <div style={{ marginBottom: "10px" }}>
                    <label>Телефон:</label>
                    <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        style={{ width: "100%", padding: "8px" }}
                    />
                </div>
                <div style={{ marginBottom: "10px" }}>
                    <label>Юзернейм:</label>
                    <input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        required
                        style={{ width: "100%", padding: "8px" }}
                    />
                </div>
                <button type="submit" style={{ padding: "10px 20px", marginTop: "10px" }}>
                    Зарегистрироваться
                </button>
            </form>
            <p>{statusMessage}</p>
        </div>
    );
}

export default RegistrationApp;
