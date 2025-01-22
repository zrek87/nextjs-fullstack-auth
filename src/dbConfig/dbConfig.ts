import mongoose from "mongoose";

export async function connect() {
  try {
    mongoose.connect(process.env.MONGO_URI!);
    const connection = mongoose.connection;

    connection.on("connected", () => {
      console.log("MongoDB connected successfully");
    });
    connection.on("error", (err) => {
      console.log(
        "MongoDB connection failed Please check your connection" + err
      );
      process.exit();
    });
  } catch (error) {
    console.log("Somthing went wrong");
    console.log(error);
  }
}
