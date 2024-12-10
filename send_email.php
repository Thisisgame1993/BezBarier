<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Pobieranie danych z formularza
    $name = $_POST['name'];
    $email = $_POST['email'];
    $message = $_POST['message'];

    // Sprawdzenie, czy wszystkie dane zostały uzupełnione
    if (empty($name) || empty($email) || empty($message)) {
        echo "Wszystkie pola muszą być wypełnione!";
        exit;
    }

    // Definiowanie adresu e-mail, na który ma być wysłana wiadomość
    $to = "adres-email@domena.com"; // Zmień na adres odbiorcy
    $subject = "Nowa wiadomość z formularza kontaktowego";

    // Treść wiadomości
    $body = "Imię: $name\nEmail: $email\nTreść wiadomości: \n$message";

    // Nagłówki wiadomości
    $headers = "From: $email" . "\r\n" .
               "Reply-To: $email" . "\r\n" .
               "X-Mailer: PHP/" . phpversion();

    // Wysyłanie wiadomości e-mail
    if (mail($to, $subject, $body, $headers)) {
        echo "Wiadomość została wysłana!";
    } else {
        echo "Błąd w wysyłaniu wiadomości. Spróbuj ponownie.";
    }
}
?>
