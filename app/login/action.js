"use server";
import {signIn} from "../../auth"

export async function action(data) {
  try {
    console.log("🚀 ~ action ~ data:", data);
    const response=await signIn("google");
    console.log("response",response)
  } catch (error) {
    console.log("error", error);
  }
}