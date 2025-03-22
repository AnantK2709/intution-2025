import yagmail

def send_email_to_employees(subject: str, message: str, recipient_list: list):
    sender_email = "mokj0802@gmail.com"
    app_password = "zwqrcvvxhmzwjuwh"  # Use Gmail app password

    try:
        yag = yagmail.SMTP(user=sender_email, password=app_password)

        for recipient in recipient_list:
            yag.send(to=recipient, subject=subject, contents=message)

        return {"status": "success", "sent_to": recipient_list}

    except Exception as e:
        return {"status": "error", "message": str(e)}
