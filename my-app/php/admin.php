<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

$pdo = new PDO("mysql:host=localhost;dbname=123123", "root", "");

// Функция для подтверждения пользователя
function approveUser($userId, $pdo) {
    $pdo->beginTransaction();
    try {
        $stmt = $pdo->prepare("SELECT * FROM pending_users WHERE id = :id");
        $stmt->execute(['id' => $userId]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($user) {
            $stmt = $pdo->prepare("INSERT INTO users (name, email, phone, username) VALUES (:name, :email, :phone, :username)");
            $stmt->execute([
                'name' => $user['name'],
                'email' => $user['email'],
                'phone' => $user['phone'],
                'username' => $user['username']
            ]);

            $stmt = $pdo->prepare("DELETE FROM pending_users WHERE id = :id");
            $stmt->execute(['id' => $userId]);

            $pdo->commit();
            return ["status" => "success", "message" => "Заявка на регистрацию одобрена"];
        } else {
            return ["status" => "error", "message" => "Пользователь не найден"];
        }
    } catch (Exception $e) {
        $pdo->rollBack();
        return ["status" => "error", "message" => "Ошибка при одобрении заявки"];
    }
}

// Функция для отклонения пользователя
function rejectUser($userId, $pdo) {
    try {
        $stmt = $pdo->prepare("DELETE FROM pending_users WHERE id = :id");
        $stmt->execute(['id' => $userId]);

        return ["status" => "success", "message" => "Заявка на регистрацию отклонена"];
    } catch (Exception $e) {
        return ["status" => "error", "message" => "Ошибка при отклонинии заявки"];
    }
}

// Функция для обработки фотографий
function handlePhoto($photoId, $action, $pdo) {
    try {
        if ($action === 'approve') {
            // Получаем фото из таблицы pending_photos
            $stmt = $pdo->prepare("SELECT * FROM pending_photos WHERE id = :photo_id");
            $stmt->execute(['photo_id' => $photoId]);
            $photo = $stmt->fetch(PDO::FETCH_ASSOC);

            if ($photo) {
                // Перемещаем фото в таблицу approved_photos
                $stmt = $pdo->prepare("INSERT INTO approved_photos (user_id, photo_path) VALUES (:user_id, :photo_path)");
                $stmt->execute([
                    'user_id' => $photo['user_id'],
                    'photo_path' => $photo['photo_path']
                ]);

                // Удаляем из таблицы pending_photos
                $stmt = $pdo->prepare("DELETE FROM pending_photos WHERE id = :photo_id");
                $stmt->execute(['photo_id' => $photoId]);

                return ["status" => "success", "message" => "Фотография подтверждена и перемещена в approved_photos"];
            } else {
                return ["status" => "error", "message" => "Фотография не найдена"];
            }
        } elseif ($action === 'reject') {
            // Отклоняем фотографию, удаляя из таблицы pending_photos
            $stmt = $pdo->prepare("DELETE FROM pending_photos WHERE id = :photo_id");
            $stmt->execute(['photo_id' => $photoId]);

            return ["status" => "success", "message" => "Фотография отклонена"];
        } else {
            return ["status" => "error", "message" => "Некорректное действие для фотографии"];
        }
    } catch (Exception $e) {
        return ["status" => "error", "message" => "Ошибка при обработке фотографии"];
    }
}

// Основной блок обработки запроса
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);
    
    if (isset($data['user_id']) && isset($data['action'])) {
        $userId = $data['user_id'];
        $action = $data['action'];

        if ($action === 'approve') {
            $response = approveUser($userId, $pdo);
        } elseif ($action === 'reject') {
            $response = rejectUser($userId, $pdo);
        } else {
            $response = ["status" => "error", "message" => "Некорректное действие для пользователя"];
        }
    } elseif (isset($data['photo_id']) && isset($data['action'])) {
        $photoId = $data['photo_id'];
        $action = $data['action'];

        $response = handlePhoto($photoId, $action, $pdo);
    } else {
        $response = ["status" => "error", "message" => "Некорректные данные запроса"];
    }

    echo json_encode($response);
}
?>