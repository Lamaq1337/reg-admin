import React, { useState, useEffect } from 'react';

function AdminPanel() {
    const [pendingUsers, setPendingUsers] = useState([]);
    const [pendingPhotos, setPendingPhotos] = useState([]);
    const [statusMessage, setStatusMessage] = useState("");

    // Функция для загрузки заявок
    const loadPendingUsers = async () => {
        try {
            const response = await fetch("http://localhost/reg-admin/my-app/php/getPendingUsers.php");
            const data = await response.json();
            setPendingUsers(data.pendingUsers || []); // если `pendingUsers` не существует, присвоить пустой массив
        } catch (error) {
            setStatusMessage("Ошибка загрузки данных пользователей");
            console.error("Ошибка при загрузке пользователей:", error); // вывод в консоль для отладки
        }
    };

    const loadPendingPhotos = async () => {
        try {
            const response = await fetch("http://localhost/reg-admin/my-app/php/getPendingPhotos.php");
            if (!response.ok) {
                throw new Error(`Ошибка: ${response.statusText}`);
            }
            const data = await response.json();
            setPendingPhotos(data.pendingPhotos || []); // если `pendingPhotos` не существует, присвоить пустой массив
        } catch (error) {
            setStatusMessage("Ошибка загрузки данных фотографий");
            console.error("Ошибка при загрузке фотографий:", error); // вывод в консоль для отладки
        }
    };

    // Первоначальная загрузка заявок и установка интервала для обновления
    useEffect(() => {
        loadPendingUsers(); // Загрузка заявок при первой загрузке компонента
        loadPendingPhotos();

        const interval = setInterval(() => {
            loadPendingUsers(); // Обновление заявок каждые 5 секунд
            loadPendingPhotos();
        }, 5000);

        return () => clearInterval(interval); // Очистка интервала при размонтировании компонента
    }, []);

    // Подтверждение или отклонение пользователя
    const handleUserRequest = async (userId, action) => {
        try {
            const response = await fetch("http://localhost/reg-admin/my-app/php/admin.php", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ user_id: userId, action: action }),
            });
            if (!response.ok) {
                throw new Error(`Ошибка HTTP: ${response.statusText}`);
            }

            const data = await response.json();
            if (data.status === "success") {
                setPendingUsers(pendingUsers.filter((user) => user.id !== userId));
            }
            setStatusMessage(data.message || "Запрос выполнен успешно");
        } catch (error) {
            console.error("Ошибка при обработке запроса пользователя:", error);
            setStatusMessage("Ошибка при обработке запроса пользователя");
        }
    };

    // Подтверждение или отклонение фотографии
    const handlePhotoRequest = async (photoId, action) => {
        try {
            const response = await fetch("http://localhost/reg-admin/my-app/php/admin.php", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ photo_id: photoId, action: action }),
            });
            if (!response.ok) {
                throw new Error(`Ошибка HTTP: ${response.statusText}`);
            }

            const data = await response.json();
            if (data.status === "success") {
                setPendingPhotos(pendingPhotos.filter((photo) => photo.id !== photoId));
            }
            setStatusMessage(data.message || "Запрос выполнен успешно");
        } catch (error) {
            console.error("Ошибка при обработке запроса фотографии:", error);
            setStatusMessage("Ошибка при обработке запроса фотографии");
        }
    };

    return (
        <div style={{ maxWidth: "600px", margin: "auto", padding: "20px", textAlign: "center" }}>
            <h1>Панель Администрирования</h1>
            {statusMessage && <p>{statusMessage}</p>}
            
            <h2>Заявки на регистрацию</h2>
            {pendingUsers.length === 0 ? (
                <p>Нет заявок на регистрацию</p>
            ) : (
                <ul>
                    {pendingUsers.map((user) => (
                        <li key={user.id} style={{ marginBottom: "15px", padding: "10px", border: "1px solid #ddd" }}>
                            <p>Имя: {user.name}</p>
                            <p>Email: {user.email}</p>
                            <p>Телефон: {user.phone}</p>
                            <p>Юзернейм: {user.username}</p>
                            <button onClick={() => handleUserRequest(user.id, "approve")} style={{ marginRight: "10px", padding: "8px" }}>
                                Подтвердить
                            </button>
                            <button onClick={() => handleUserRequest(user.id, "reject")} style={{ padding: "8px" }}>
                                Отклонить
                            </button>
                        </li>
                    ))}
                </ul>
            )}

            <h2>Загруженные фотографии</h2>
            {pendingPhotos.length === 0 ? (
                <p>Нет загруженных фотографий</p>
            ) : (
                <ul>
                    {pendingPhotos.map((photo) => (
                        <li key={photo.id} style={{ marginBottom: "15px", padding: "10px", border: "1px solid #ddd" }}>
                            <img src={`http://localhost/reg-admin/my-app/php/uploaded_photos/${photo.file_name}`} alt="Фото" style={{ width: '150px', height: 'auto' }} />
                            <button onClick={() => handlePhotoRequest(photo.id, "approve")} style={{ marginRight: "10px", padding: "8px" }}>
                                Подтвердить
                            </button>
                            <button onClick={() => handlePhotoRequest(photo.id, "reject")} style={{ padding: "8px" }}>
                                Отклонить
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default AdminPanel;
