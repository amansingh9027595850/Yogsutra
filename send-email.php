<?php
/**
 * PHP Contact Form Handler
 * Routes form submissions from contact.html directly to the owner's email.
 */

// Set response header to JSON
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *'); // Allow requests from any origin (CORS)
header('Access-Control-Allow-Headers: Content-Type');
header('Access-Control-Allow-Methods: POST, OPTIONS');

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

// Ensure it's a POST request
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'error' => 'Method Not Allowed']);
    exit;
}

// Retrieve raw JSON POST data
$inputJSON = file_get_contents('php://input');
$input = json_decode($inputJSON, true);

// If request is not JSON, check standard POST fields
if (!$input) {
    $input = $_POST;
}

// Extract and sanitize input data
$name = isset($input['Name']) ? strip_tags(trim($input['Name'])) : '';
$email = isset($input['Email']) ? filter_var(trim($input['Email']), FILTER_SANITIZE_EMAIL) : '';
$phone = isset($input['Phone']) ? strip_tags(trim($input['Phone'])) : '';
$subject = isset($input['Subject']) ? strip_tags(trim($input['Subject'])) : 'General Inquiry';
$message = isset($input['Message']) ? strip_tags(trim($input['Message'])) : '';

// Validation
if (empty($name) || empty($email) || empty($message)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Please fill in all required fields (Name, Email, Message).']);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Invalid email address.']);
    exit;
}

// Recipient Email Address
$recipient = 'yogsutrayogshala@gmail.com';

// Subject Line for the Email
$email_subject = "New Yogsutra Inquiry: $subject from $name";

// Email Message Content
$email_content = "You have received a new message from your website contact form.\n\n";
$email_content .= "Name: $name\n";
$email_content .= "Email: $email\n";
if (!empty($phone)) {
    $email_content .= "Phone: $phone\n";
}
$email_content .= "Subject: $subject\n\n";
$email_content .= "Message:\n$message\n";

// Email Headers
$email_headers = "From: Yogsutra Website <no-reply@yogsutrayogshala.com>\r\n";
$email_headers .= "Reply-To: $name <$email>\r\n";
$email_headers .= "X-Mailer: PHP/" . phpversion();

// Send Email
if (mail($recipient, $email_subject, $email_content, $email_headers)) {
    http_response_code(200);
    echo json_encode(['success' => true, 'message' => 'Thank you! Your message has been sent.']);
} else {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'Unable to send email. Please check your mail server configuration.']);
}
?>
