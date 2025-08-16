# 📧 Serverless Email API

A serverless REST API built with the Serverless Framework that sends emails using Gmail SMTP. This API provides a simple endpoint to send emails programmatically with comprehensive error handling and validation.

## 🚀 Features

- ✅ **REST API endpoint** for sending emails
- ✅ **Gmail SMTP integration** with App Password authentication
- ✅ **Comprehensive input validation** (email format, required fields)
- ✅ **Detailed error handling** with appropriate HTTP status codes
- ✅ **CORS support** for web applications
- ✅ **Local development** with serverless-offline
- ✅ **AWS Lambda deployment** ready
- ✅ **Professional logging** and request tracking

## 📋 API Specification

### Endpoint
```
POST /dev/send-email
```

### Request Body
```json
{
  "receiver_email": "recipient@example.com",
  "subject": "Your email subject",
  "body_text": "Your email content here"
}
```

### Response Examples

#### Success (200 OK)
```json
{
  "success": true,
  "message": "Email sent successfully",
  "messageId": "<message-id@gmail.com>",
  "recipient": "recipient@example.com"
}
```

#### Validation Error (400 Bad Request)
```json
{
  "error": "Validation failed",
  "message": "Invalid request parameters",
  "details": [
    "receiver_email must be a valid email address",
    "subject cannot be empty"
  ]
}
```

#### Server Error (500 Internal Server Error)
```json
{
  "error": "Email service unavailable",
  "message": "Unable to connect to email service"
}
```

## 🛠️ Tech Stack

- **Runtime**: Node.js 18.x
- **Framework**: Serverless Framework v3
- **Email Service**: Nodemailer with Gmail SMTP
- **Development**: serverless-offline plugin
- **Deployment**: AWS Lambda + API Gateway

## 📦 Prerequisites

Before you begin, ensure you have:

- **Node.js** (version 14 or higher)
- **npm** or **yarn** package manager
- **Gmail account** with 2-factor authentication enabled
- **Serverless Framework** account (optional for deployment)

## ⚡ Quick Start

### 1. Clone the Repository
```bash
git clone https://github.com/abhisheksingh0505/serverless_email.git
cd serverless_email
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Create a `.env` file in the root directory:
```bash
# Gmail Configuration
GMAIL_USER=your-email@gmail.com
GMAIL_APP_PASSWORD=your-16-character-app-password
```

### 4. Get Gmail App Password
1. Go to [Google Account Settings](https://myaccount.google.com)
2. Navigate to **Security** → **2-Step Verification** (enable if not already)
3. Go to **App passwords**
4. Select **Mail** app and **Other** device
5. Enter name: "Serverless Email API"
6. Copy the generated 16-character password
7. Use this password in your `.env` file

### 5. Run Locally
```bash
npm run dev
```

The API will be available at: `http://localhost:3000/dev/send-email`

## 🧪 Testing the API

### Using curl
```bash
curl -X POST http://localhost:3000/dev/send-email \
  -H "Content-Type: application/json" \
  -d '{
    "receiver_email": "test@example.com",
    "subject": "Test Email",
    "body_text": "Hello from serverless API!"
  }'
```

### Using JavaScript/Fetch
```javascript
const response = await fetch('http://localhost:3000/dev/send-email', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    receiver_email: 'test@example.com',
    subject: 'Test Email',
    body_text: 'Hello from serverless API!'
  })
});

const result = await response.json();
console.log(result);
```

### Using Postman
1. **Method**: POST
2. **URL**: `http://localhost:3000/dev/send-email`
3. **Headers**: `Content-Type: application/json`
4. **Body**: Raw JSON with the required fields

## 🚀 Deployment

### Deploy to AWS
1. Configure AWS credentials:
```bash
serverless config credentials --provider aws --key YOUR_ACCESS_KEY --secret YOUR_SECRET_KEY
```

2. Deploy the service:
```bash
npm run deploy
```

3. The deployed API endpoint will be displayed after successful deployment.

## 📁 Project Structure

```
serverless-email-api/
├── handler.js              # Main Lambda function
├── serverless.yml          # Serverless configuration
├── package.json            # Dependencies and scripts
├── .env                    # Environment variables (not in repo)
├── .env.example           # Environment template
├── .gitignore             # Git ignore rules
└── README.md              # Project documentation
```

## 🔧 Configuration

### Serverless.yml Options
- **Runtime**: nodejs18.x
- **Memory**: 128 MB (default)
- **Timeout**: 6 seconds (default)
- **Region**: us-east-1 (configurable)
- **Stage**: dev (configurable)

### Environment Variables
| Variable | Description | Required |
|----------|-------------|----------|
| `GMAIL_USER` | Gmail email address | ✅ |
| `GMAIL_APP_PASSWORD` | Gmail app-specific password | ✅ |

## 🛡️ Security Features

- **Input validation** with regex patterns
- **Error handling** without exposing sensitive information
- **App password authentication** (more secure than regular passwords)
- **CORS configuration** for cross-origin requests
- **Environment variable protection**

## 📊 Error Handling

The API handles various error scenarios:

- **400 Bad Request**: Invalid JSON, missing fields, invalid email format
- **500 Internal Server Error**: SMTP connection issues, authentication failures
- **Network errors**: Connection timeouts, DNS resolution failures

## 🧩 Supported Email Providers

While configured for Gmail by default, the API can be modified to support:
- Yahoo Mail
- Outlook/Hotmail
- Custom SMTP servers
- SendGrid, Mailgun (with minor modifications)

## 📈 Performance

- **Cold start**: ~2-3 seconds (first request)
- **Warm execution**: ~200-500ms
- **Memory usage**: ~50MB
- **Concurrent requests**: Supports multiple simultaneous requests

## 🐛 Troubleshooting

### Common Issues

1. **"Authentication failed" error**
   - Ensure 2-factor authentication is enabled
   - Use App Password, not regular Gmail password
   - Check for typos in email/password

2. **"Cannot resolve serverless.yaml" error**
   - Ensure `.env` file exists in project root
   - Verify environment variables are set correctly

3. **Port already in use**
   - Change port in `serverless.yml` under `custom.serverless-offline.httpPort`
   - Kill existing processes using the port

4. **Email not received**
   - Check spam/junk folder
   - Verify recipient email address
   - Check Gmail sent items

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 Scripts

```bash
npm run dev        # Start local development server
npm run deploy     # Deploy to AWS
npm install        # Install dependencies
```



## 👤 Author

**Abhishek Singh**
- GitHub: [@abhisheksingh0505](https://github.com/abhisheksingh0505)
- Email: singh0500530@gmail.com

## 🙏 Acknowledgments

- [Serverless Framework](https://www.serverless.com/) for the amazing serverless toolkit
- [Nodemailer](https://nodemailer.com/) for email sending capabilities
- [Gmail SMTP](https://support.google.com/mail/answer/7126229) for reliable email delivery

## 📞 Support

If you have any questions or run into issues:

1. Check the [Troubleshooting](#-troubleshooting) section
2. Open an issue on GitHub
3. Check [Serverless Framework documentation](https://www.serverless.com/framework/docs/)

---

⭐ **If this project helped you, please give it a star!**
