<?php
header('Content-Type: application/json; charset=utf-8');

if ($_SERVER["REQUEST_METHOD"] != "POST") {
    http_response_code(403);
    echo json_encode(['success' => false, 'message' => 'Доступ запрещён'], JSON_UNESCAPED_UNICODE);
    exit;
}

// Получаем данные
$name = isset($_POST['name']) ? trim($_POST['name']) : '';
$phone = isset($_POST['phone']) ? trim($_POST['phone']) : '';
$message = isset($_POST['message']) ? trim($_POST['message']) : '';

$topics = [];
if (!empty($_POST['topic'])) {
    if (is_array($_POST['topic'])) {
        foreach ($_POST['topic'] as $topic) {
            $topic = trim($topic);
            if ($topic !== '') {
                $topics[] = $topic;
            }
        }
    } else {
        $topic = trim($_POST['topic']);
        if ($topic !== '') {
            $topics[] = $topic;
        }
    }
}
$topic_text = !empty($topics) ? implode(', ', $topics) : 'Не указано';

// Проверка на заполнение обязательных полей
if (empty($name) || empty($phone)) {
    echo json_encode(['success' => false, 'message' => 'Заполните имя и телефон'], JSON_UNESCAPED_UNICODE);
    exit;
}

// ======= НАСТРОЙТЕ ЭТИ ПАРАМЕТРЫ =======
$to_email = "ваша_почта@yandex.ru"; // ЗАМЕНИТЕ НА ВАШ EMAIL
$subject = "=?UTF-8?B?" . base64_encode("Новая заявка с сайта Лесопилка") . "?=";
// =======================================

// Формируем письмо
$email_content = "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n";
$email_content .= "📋 НОВАЯ ЗАЯВКА С САЙТА\n";
$email_content .= "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n";
$email_content .= "👤 Имя: " . $name . "\n";
$email_content .= "📞 Телефон: " . $phone . "\n";
$email_content .= "� По вопросам: " . $topic_text . "\n";
$email_content .= "�📝 Сообщение: " . ($message ?: "Не указано") . "\n\n";
$email_content .= "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n";
$email_content .= "📅 Дата: " . date("d.m.Y H:i:s") . "\n";
$email_content .= "🌐 IP: " . $_SERVER['REMOTE_ADDR'] . "\n";
$email_content .= "🌍 Страница: " . ($_SERVER['HTTP_REFERER'] ?? 'Не указана') . "\n";

// Заголовки
$headers = "MIME-Version: 1.0\r\n";
$headers .= "Content-Type: text/plain; charset=utf-8\r\n";
$headers .= "From: =?UTF-8?B?" . base64_encode("Сайт Лесопилка") . "?= <noreply@" . $_SERVER['HTTP_HOST'] . ">\r\n";
$headers .= "Reply-To: " . $phone . "\r\n";

// Отправка
$send_result = mail($to_email, $subject, $email_content, $headers);

if ($send_result) {
    echo json_encode(['success' => true, 'message' => 'Заявка отправлена'], JSON_UNESCAPED_UNICODE);
} else {
    // Если mail() не работает, логируем ошибку (без вывода клиенту)
    error_log("Ошибка отправки почты на $to_email");
    echo json_encode(['success' => false, 'message' => 'Ошибка отправки. Позвоните нам по телефону.'], JSON_UNESCAPED_UNICODE);
}
?>