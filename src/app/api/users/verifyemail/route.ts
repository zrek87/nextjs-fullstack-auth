import { connect } from "@/dbConfig/dbConfig";
import { NextRequest, NextResponse } from "next/server";
import User from "@/models/userModel";
import bcryptjs from "bcryptjs";

export async function POST(request: NextRequest) {
  try {
    // Connect to the database
    await connect();

    // Parse the request body
    const reqBody = await request.json();
    const { token } = reqBody;

    // Validate the token
    if (!token) {
      return NextResponse.json({ error: "Token is required" }, { status: 400 });
    }

    // Find the user with the provided token
    const user = await User.findOne({
      verifyToken: token, // Filter by token
      verifyTokenExpiry: { $gt: Date.now() }, // Ensure token is not expired
    });

    if (!user) {
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 400 }
      );
    }

    // Compare the token (optional, depending on your implementation)
    const isTokenValid = await bcryptjs.compare(token, user.verifyToken);
    if (!isTokenValid) {
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 400 }
      );
    }

    // Update the user to mark email as verified
    user.isVerified = true;
    user.verifyToken = undefined;
    user.verifyTokenExpiry = undefined;
    await user.save();

    // Return success response
    return NextResponse.json({
      message: "Email verified successfully",
      success: true,
    });
  } catch (error: unknown) {
    console.error("Error verifying email:", error);
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message || "An unexpected error occurred" },
        { status: 500 }
      );
    }
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
