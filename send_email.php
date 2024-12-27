<?php
require 'vendor/autoload.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Pobierz dane z formularza
    $name = trim($_POST['name']);
    $email = trim($_POST['email']);
    $message = trim($_POST['message']);

    // Sprawdzenie wypełnienia wszystkich pól formularza
    if (empty($name) || empty($email) || empty($message)) {
        echo "Wszystkie pola muszą być wypełnione!";
        exit;
    }

    // Konfiguracja PHPMailer
    $mail = new PHPMailer(true);

    try {
        // Ustawienia debugowania i serwera SMTP
       $mail->isSMTP(); 
$mail->Host = 'smtp.poczta.onet.pl';  
$mail->SMTPAuth = true;
$mail->Username = 'bez_barier@onet.pl';  
$mail->Password = 'Thisisgame1993!#';  
$mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS; 
$mail->Port = 587; 

        // Ustawienia dla nadawcy i odbiorcy
        $mail->setFrom('bez_barier@onet.pl', 'Bez Barier');
        $mail->addAddress('bez_barier@onet.pl'); 

        // Treść wiadomości
        $mail->isHTML(false);
        $mail->Subject = 'Nowa wiadomość z formularza kontaktowego';
        $mail->Body = "Imię: $name\nEmail: $email\nTreść wiadomości: \n$message";

        // Wysyłanie wiadomości
        $mail->send();
        echo "Wiadomość została wysłana!";
    } catch (Exception $e) {
        echo "Błąd: {$mail->ErrorInfo}";
    }
}
?>
