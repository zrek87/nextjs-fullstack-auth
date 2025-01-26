import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import { sendEmail } from "@/helpers/mailer";

export async function POST(request: NextRequest) {
  try {
    // Connect to the database
    console.log("Connecting to database...");
    await connect();

    // Parse the request body
    const reqBody = await request.json();
    const { username, email, password } = reqBody;

    // Validate inputs
    if (!username || typeof username !== "string" || username.trim() === "") {
      return NextResponse.json({ error: "Invalid username" }, { status: 400 });
    }
    if (
      !email ||
      typeof email !== "string" ||
      !email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)
    ) {
      return NextResponse.json(
        { error: "Invalid email address" },
        { status: 400 }
      );
    }
    if (!password || password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters long" },
        { status: 400 }
      );
    }

    console.log("Validated inputs:", { username, email });

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.error("User already exists:", email);
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      );
    }

    // Hash the password
    console.log("Hashing password...");
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    // Create and save the user
    console.log("Creating user...");
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });
    const savedUser = await newUser.save();
    console.log("User created successfully:", savedUser);

    // Send verification email
    try {
      console.log("Sending verification email...");
      await sendEmail({
        email,
        emailType: "VERIFY",
        userId: savedUser._id,
      });
      console.log("Verification email sent successfully.");
    } catch (emailError) {
      console.error("Failed to send verification email. Error:", emailError);
      return NextResponse.json(
        { message: "User created, but verification email could not be sent" },
        { status: 500 }
      );
    }

    // Return success response
    return NextResponse.json({
      message: "User created successfully",
      success: true,
    });
  } catch (error: any) {
    console.error("Signup error:", error.message);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
