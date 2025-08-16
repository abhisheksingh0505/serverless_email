const nodemailer = require('nodemailer');

// Email validation regex
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Create transporter (using Gmail as example)
const createTransporter = () => {
  return nodemailer.createTransporter({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD
    }
  });
};

// Validate request body
const validateRequest = (body) => {
  const errors = [];
  
  if (!body.receiver_email) {
    errors.push('receiver_email is required');
  } else if (!emailRegex.test(body.receiver_email)) {
    errors.push('receiver_email must be a valid email address');
  }
  
  if (!body.subject) {
    errors.push('subject is required');
  } else if (body.subject.trim().length === 0) {
    errors.push('subject cannot be empty');
  }
  
  if (!body.body_text) {
    errors.push('body_text is required');
  } else if (body.body_text.trim().length === 0) {
    errors.push('body_text cannot be empty');
  }
  
  return errors;
};

// Create HTTP response
const createResponse = (statusCode, body, headers = {}) => {
  return {
    statusCode,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      ...headers
    },
    body: JSON.stringify(body)
  };
};

// Main handler function
exports.sendEmail = async (event) => {
  try {
    // Handle preflight OPTIONS request
    if (event.httpMethod === 'OPTIONS') {
      return createResponse(200, {});
    }

    // Parse request body
    let requestBody;
    try {
      requestBody = JSON.parse(event.body || '{}');
    } catch (parseError) {
      return createResponse(400, {
        error: 'Invalid JSON in request body',
        message: 'Request body must be valid JSON'
      });
    }

    // Validate request
    const validationErrors = validateRequest(requestBody);
    if (validationErrors.length > 0) {
      return createResponse(400, {
        error: 'Validation failed',
        message: 'Invalid request parameters',
        details: validationErrors
      });
    }

    // Check environment variables
    if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
      return createResponse(500, {
        error: 'Server configuration error',
        message: 'Email service not properly configured'
      });
    }

    // Create transporter
    const transporter = createTransporter();

    // Verify transporter connection
    try {
      await transporter.verify();
    } catch (verifyError) {
      console.error('SMTP connection failed:', verifyError);
      return createResponse(500, {
        error: 'Email service unavailable',
        message: 'Unable to connect to email service'
      });
    }

    // Email options
    const mailOptions = {
      from: process.env.GMAIL_USER,
      to: requestBody.receiver_email,
      subject: requestBody.subject.trim(),
      text: requestBody.body_text.trim()
    };

    // Send email
    try {
      const info = await transporter.sendMail(mailOptions);
      
      return createResponse(200, {
        success: true,
        message: 'Email sent successfully',
        messageId: info.messageId,
        recipient: requestBody.receiver_email
      });
      
    } catch (sendError) {
      console.error('Email send failed:', sendError);
      
      // Handle specific email errors
      if (sendError.code === 'EAUTH') {
        return createResponse(500, {
          error: 'Authentication failed',
          message: 'Invalid email credentials'
        });
      } else if (sendError.code === 'ECONNECTION') {
        return createResponse(500, {
          error: 'Connection failed',
          message: 'Unable to connect to email server'
        });
      } else if (sendError.responseCode === 550) {
        return createResponse(400, {
          error: 'Invalid recipient',
          message: 'The recipient email address is invalid or does not exist'
        });
      } else {
        return createResponse(500, {
          error: 'Email sending failed',
          message: 'An error occurred while sending the email'
        });
      }
    }

  } catch (error) {
    console.error('Unexpected error:', error);
    return createResponse(500, {
      error: 'Internal server error',
      message: 'An unexpected error occurred'
    });
  }
};