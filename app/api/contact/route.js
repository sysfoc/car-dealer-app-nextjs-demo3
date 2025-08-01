import { NextResponse } from "next/server"
import connectDB from "../../lib/mongodb"
import ContactMessage from "../../models/Contact"
import nodemailer from "nodemailer"

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
})

export async function POST(request) {
  try {
    await connectDB()

    const body = await request.json()
    const { name, email, message } = body

    if (!name || !email || !message) {
      return NextResponse.json({ error: "All required fields must be provided." }, { status: 400 })
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Invalid email format." }, { status: 400 })
    }

    // Create and save contact message
    const contactMessage = new ContactMessage({
      name,
      email,
      message,
      status: "pending",
    })

    await contactMessage.save()

    return NextResponse.json(
      {
        message: "Contact message submitted successfully.",
        messageId: contactMessage._id,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Contact message submission error:", error)
    return NextResponse.json({ error: "Failed to submit contact message. Please try again later." }, { status: 500 })
  }
}

export async function GET() {
  try {
    await connectDB()

    const contactMessages = await ContactMessage.find({}).sort({ createdAt: -1 })

    return NextResponse.json(contactMessages, { status: 200 })
  } catch (error) {
    console.error("Error fetching contact messages:", error)
    return NextResponse.json({ error: "Failed to fetch contact messages." }, { status: 500 })
  }
}

export async function PUT(request) {
  try {
    await connectDB()

    const body = await request.json()
    const { messageId, adminReply, repliedBy } = body

    if (!messageId || !adminReply || !repliedBy) {
      return NextResponse.json({ error: "Message ID, admin reply, and replied by are required." }, { status: 400 })
    }

    const contactMessage = await ContactMessage.findById(messageId)
    if (!contactMessage) {
      return NextResponse.json({ error: "Contact message not found." }, { status: 404 })
    }

    // Update message with admin reply
    contactMessage.adminReply = adminReply
    contactMessage.repliedBy = repliedBy
    contactMessage.status = "answered"
    contactMessage.repliedAt = new Date()

    await contactMessage.save()

    // Send email to customer
    try {
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: contactMessage.email,
        subject: "Response to Your Contact Message",
        html: `
          <!DOCTYPE html>
          <html lang="en">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Contact Message Response</title>
          </head>
          <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif; background-color: #f5f5f5;">
            <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 20px 0;">
              <tr>
                <td align="center">
                  <table width="600" cellpadding="0" cellspacing="0" style="max-width: 600px; width: 100%; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);">
                    <!-- Header Section -->
                    <tr>
                      <td style="background: linear-gradient(135deg, #2c3e50 0%, #3498db 100%); padding: 40px 30px; text-align: center;">
                        <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 700; letter-spacing: -0.5px;">Car Dealership</h1>
                        <p style="color: #ecf0f1; margin: 8px 0 0 0; font-size: 16px; font-weight: 400;">Response to Your Contact Message</p>
                      </td>
                    </tr>
                    <!-- Main Content -->
                    <tr>
                      <td style="padding: 40px 30px;">
                        <!-- Greeting -->
                        <h2 style="color: #2c3e50; margin: 0 0 20px 0; font-size: 24px; font-weight: 600;">Dear ${contactMessage.name},</h2>
                        <p style="color: #5a6c7d; line-height: 1.6; margin: 0 0 30px 0; font-size: 16px;">Thank you for contacting us. We have carefully reviewed your message and are pleased to provide you with our response below.</p>
                        <!-- Original Message Section -->
                        <div style="background-color: #f8f9fa; border: 1px solid #e9ecef; border-radius: 8px; padding: 24px; margin: 0 0 24px 0;">
                          <div style="display: flex; align-items: center; margin-bottom: 16px;">
                            <div style="width: 4px; height: 20px; background-color: #6c757d; margin-right: 12px; border-radius: 2px;"></div>
                            <h3 style="color: #495057; margin: 0; font-size: 18px; font-weight: 600;">Your Original Message</h3>
                          </div>
                          <p style="color: #6c757d; line-height: 1.5; margin: 0; font-size: 15px; font-style: italic;">${contactMessage.message}</p>
                        </div>
                        <!-- Response Section -->
                        <div style="background-color: #f8fff9; border: 1px solid #d1ecf1; border-radius: 8px; padding: 24px; margin: 0 0 30px 0;">
                          <div style="display: flex; align-items: center; margin-bottom: 16px;">
                            <div style="width: 4px; height: 20px; background-color: #28a745; margin-right: 12px; border-radius: 2px;"></div>
                            <h3 style="color: #155724; margin: 0; font-size: 18px; font-weight: 600;">Our Response</h3>
                          </div>
                          <p style="color: #155724; line-height: 1.6; margin: 0; font-size: 15px; white-space: pre-line;">${adminReply}</p>
                        </div>
                        <!-- Additional Information -->
                        <div style="background-color: #fff9f0; border: 1px solid #ffeaa7; border-radius: 8px; padding: 20px; margin: 0 0 30px 0;">
                          <p style="color: #856404; line-height: 1.5; margin: 0; font-size: 14px;">
                            <strong>Need Further Assistance?</strong><br>
                            If you have any additional questions or need more information, please don't hesitate to contact us directly. Our team is here to help you.
                          </p>
                        </div>
                        <!-- Contact Information -->
                        <div style="border-top: 1px solid #e9ecef; padding-top: 24px; margin-top: 30px;">
                          <h4 style="color: #2c3e50; margin: 0 0 16px 0; font-size: 16px; font-weight: 600;">Contact Information</h4>
                          <table width="100%" cellpadding="8" cellspacing="0" style="font-size: 14px; color: #5a6c7d;">
                            <tr>
                              <td style="width: 80px; font-weight: 600;">Phone:</td>
                              <td>+1 (555) 123-4567</td>
                            </tr>
                            <tr>
                              <td style="font-weight: 600;">Email:</td>
                              <td>${process.env.EMAIL_USER}</td>
                            </tr>
                            <tr>
                              <td style="font-weight: 600;">Hours:</td>
                              <td>Mon-Fri: 9:00 AM - 7:00 PM, Sat: 9:00 AM - 5:00 PM</td>
                            </tr>
                          </table>
                        </div>
                      </td>
                    </tr>
                    <!-- Footer -->
                    <tr>
                      <td style="background-color: #f8f9fa; padding: 24px 30px; text-align: center; border-top: 1px solid #e9ecef;">
                        <p style="color: #6c757d; margin: 0 0 8px 0; font-size: 14px; font-weight: 600;">Best regards,</p>
                        <p style="color: #495057; margin: 0; font-size: 14px; font-weight: 700;">Car Dealership Team</p>
                        <p style="color: #adb5bd; margin: 16px 0 0 0; font-size: 12px;">This email was sent in response to your contact message. Please do not reply directly to this email.</p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </body>
          </html>
        `,
      }

      await transporter.sendMail(mailOptions)
    } catch (emailError) {
      console.error("Email sending error:", emailError)
      // Don't fail the request if email fails
    }

    return NextResponse.json({ message: "Reply sent successfully and customer notified." }, { status: 200 })
  } catch (error) {
    console.error("Error replying to contact message:", error)
    return NextResponse.json({ error: "Failed to send reply." }, { status: 500 })
  }
}

export async function DELETE(request) {
  try {
    await connectDB()
    const body = await request.json()
    const { messageId } = body

    if (!messageId) {
      return NextResponse.json({ error: "Message ID is required." }, { status: 400 })
    }

    const deletedMessage = await ContactMessage.findByIdAndDelete(messageId)
    
    if (!deletedMessage) {
      return NextResponse.json({ error: "Contact message not found." }, { status: 404 })
    }

    return NextResponse.json({ message: "Contact message deleted successfully." }, { status: 200 })
    
  } catch (error) {
    console.error("Error deleting contact message:", error)
    return NextResponse.json({ error: "Failed to delete contact message." }, { status: 500 })
  }
}