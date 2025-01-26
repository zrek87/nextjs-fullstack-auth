import nodemailer from "nodemailer";
import User from "@/models/userModel";
import bcryptjs from "bcryptjs";

export const sendEmail = async ({
  email,
  emailType,
  userId,
}: {
  email: string;
  emailType: "VERIFY" | "RESET";
  userId: string;
}) => {
  try {
    console.log("Preparing to send email...");
    console.log("Email to send:", email);
    console.log("User ID:", userId);

    // Generate hashed token
    const hashedToken = await bcryptjs.hash(userId.toString(), 10);
    console.log("Generated hashed token:", hashedToken);

    // Update the user with the token and expiry
    if (emailType === "VERIFY") {
      await User.findByIdAndUpdate(userId, {
        verifyToken: hashedToken,
        verifyTokenExpiry: Date.now() + 3600000, // 1 hour expiry
      });
    } else if (emailType === "RESET") {
      await User.findByIdAndUpdate(userId, {
        forgotPasswordToken: hashedToken,
        forgotPasswordExpiry: Date.now() + 3600000, // 1 hour expiry
      });
    } else {
      throw new Error("Invalid email type");
    }

    console.log("Updated user with token");

    // Configure the transport
    const transport = nodemailer.createTransport({
      host: process.env.MAILTRAP_HOST || "sandbox.smtp.mailtrap.io",
      port: parseInt(process.env.MAILTRAP_PORT || "2525"),
      auth: {
        user: process.env.MAILTRAP_USER,
        pass: process.env.MAILTRAP_PASS,
      },
    });

    // Define email content
    const mailOptions = {
      from: `"No Reply" <noreply@example.com>`,
      to: email,
      subject:
        emailType === "VERIFY" ? "Verify your email" : "Reset your password",
      html: `<p>Click <a href="${process.env.DOMAIN}/${
        emailType === "VERIFY" ? "verifyemail" : "resetpassword"
      }?token=${hashedToken}">here</a> to ${
        emailType === "VERIFY" ? "verify your email" : "reset your password"
      }or copy and paste the link in your browser. <br> ${
        process.env.domain
      }/verifyemail?token=${hashedToken}</p>`,
    };

    console.log("Mail options:", mailOptions);

    // Send the email
    const mailResponse = await transport.sendMail(mailOptions);
    console.log(`Email sent successfully to ${email}:`, mailResponse);
    return mailResponse;
  } catch (error: any) {
    console.error("Failed to send email:", error.message);
    throw new Error(`Email failed: ${error.message}`);
  }
};
