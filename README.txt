PAYMENT PAGE — SETUP GUIDE
==========================

FILES
- index.html   Main page
- style.css    Responsive design
- config.js    Your payment details (edit this file)
- script.js    QR code, UPI link, copy buttons

BEFORE USING
1. Open config.js in Notepad or VS Code.
2. Replace:
   - displayName: your name shown on the page
   - upiId: your actual UPI ID from your UPI app
   - accountHolder: exact account holder name
   - accountNumber: your bank account number
   - ifsc: your bank IFSC code
   - branch: optional branch name
3. Save the file and open index.html in a browser.
4. Test the QR with a UPI app and verify the recipient name shown by the app before sending any money.

IMPORTANT SAFETY NOTES
- This is a static payment page, not a payment gateway.
- It creates a UPI payment QR and a UPI app link. The payer must review and authorize the payment in their UPI app.
- Bank details are shown publicly if you host this website publicly. Only publish details you are comfortable sharing.
- Never ask for or store anyone's UPI PIN, OTP, debit card PIN, or banking password.
- The page cannot verify a successful payment automatically. Confirm receipt in your own bank/UPI app.
- Do not claim a payment was successful based only on a screenshot sent by a payer.
- The QR code uses the QRCode.js library from cdnjs, so an internet connection is required for the QR library to load.
- For production/business use, consider a verified payment gateway and server-side payment verification.
