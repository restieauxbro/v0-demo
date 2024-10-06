"use server";

import { cookies } from "next/headers";

export async function checkPassword(password: string): Promise<boolean> {
  // Replace this with your actual password checking logic
  const correctPassword = process.env.SITE_PASSWORD;
  
  if (password === correctPassword) {
    // Set a cookie to remember that the password was entered correctly
    cookies().set("password_verified", "true", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 7, // 1 week
    });
    return true;
  }
  
  return false;
}
