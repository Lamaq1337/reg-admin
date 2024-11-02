<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

$pdo = new PDO("mysql:host=localhost;dbname=123123", "root", "");

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (isset($_FILES['photo']) && $_FILES['photo']['error'] === UPLOAD_ERR_OK) {
        $fileTmpPath = $_FILES['photo']['tmp_name'];
        $fileName = $_FILES['photo']['name'];
        $fileSize = $_FILES['photo']['size'];
        $fileType = $_FILES['photo']['type'];
        
        // Задайте путь, где вы хотите сохранить фотографии
        $uploadFileDir = 'C:/xampp/htdocs/TEST111/my-app/php/uploaded_photos/';
        $dest_path = $uploadFileDir . $fileName;

        // Перемещаем загруженный файл
        if(move_uploaded_file($fileTmpPath, $dest_path)) {
            // Сохраняем информацию о фотографии в базе данных
            $stmt = $pdo->prepare("INSERT INTO pending_photos (file_name, file_path) VALUES (:file_name, :file_path)");
            $stmt->execute(['file_name' => $fileName, 'file_path' => $dest_path]);

            echo json_encode(["status" => "success", "message" => "Фотография загружена успешно."]);
        } else {
            echo json_encode(["status" => "error", "message" => "Ошибка при перемещении файла."]);
        }
    } else {
        echo json_encode(["status" => "error", "message" => "Ошибка загрузки файла."]);
    }
} else {
    echo json_encode(["status" => "error", "message" => "Некорректный метод запроса."]);
}
?>
