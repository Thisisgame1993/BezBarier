<!DOCTYPE html>
<html lang="pl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Formularz kontaktowy</title>
    <style>
        .alert-popup {
            display: none;
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background-color: white;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
            width: 300px;
            z-index: 1000;
        }

        .alert-popup.success {
            border: 2px solid green;
            color: green;
        }

        .alert-popup.error {
            border: 2px solid red;
            color: red;
        }

        .alert-popup button {
            background-color: #f1c40f;
            border: none;
            padding: 10px;
            width: 100%;
            font-size: 1.2rem;
            cursor: pointer;
            border-radius: 4px;
        }
    </style>
</head>
<body>

<?php
// Załaduj autoloader PHPMailera
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;
require 'C:\xampp\htdocs\php1\vendor\autoload.php';

// Inicjalizuj zmienną alertMessage
$alertMessage = '';
$alertType = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Pobierz dane z formularza
    $name = filter_input(INPUT_POST, 'name', FILTER_SANITIZE_FULL_SPECIAL_CHARS);
    $email = filter_input(INPUT_POST, 'email', FILTER_SANITIZE_EMAIL);
    $message = filter_input(INPUT_POST, 'message', FILTER_SANITIZE_FULL_SPECIAL_CHARS);

    // Sprawdź, czy dane są poprawne
    if ($name && $email && $message) {
        $mail = new PHPMailer(true);
        try {
            // Ustawienia serwera SMTP
            $mail->isSMTP();
            $mail->Host = 'smtp.poczta.onet.pl';
            $mail->SMTPAuth = true;
            $mail->Username = 'bez_barier@onet.pl';
            $mail->Password = 'Thisisgame1993!#';
            $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
            $mail->Port = 587;

            // Nadawca
            $mail->setFrom('bez_barier@onet.pl', 'Stowarzyszenie bez Barier');

            // Odbiorca
            $mail->addAddress('bez_barier@onet.pl');

            // Treść wiadomości
            $mail->isHTML(true);
            $mail->Subject = 'Nowa wiadomość z formularza kontaktowego';
            $mail->Body    = "<p><strong>Imię:</strong> $name</p>
                              <p><strong>Adres e-mail:</strong> $email</p>
                              <p><strong>Treść wiadomości:</strong></p>
                              <p>$message</p>";

            // Wysyłanie wiadomości
            $mail->send();
            $alertMessage = 'Wiadomość została wysłana.';
            $alertType = 'success';
        } catch (Exception $e) {
            $alertMessage = "Wiadomość nie mogła zostać wysłana. Błąd: {$mail->ErrorInfo}";
            $alertType = 'error';
        }
    } else {
        $alertMessage = 'Proszę wypełnić wszystkie pola formularza.';
        $alertType = 'error';
    }
}
?>

<?php if ($alertMessage): ?>
    <div class="alert-popup <?php echo $alertType === 'success' ? 'success' : 'error'; ?>" id="alertPopup">
        <p><?php echo $alertMessage; ?></p>
        <button onclick="closeAlert()">Zamknij okno</button>
    </div>
<?php endif; ?>

<script>
    function closeAlert() {
        setTimeout(function() {
            window.location.href = 'index.html';
        }, 500);
    }

    <?php if ($alertMessage): ?>
        document.getElementById('alertPopup').style.display = 'block';
    <?php endif; ?>
</script>

</body>
</html>
