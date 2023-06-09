"use client";

import { auth } from "@/lib/firebaseConfig";
import router from "next/router";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";

export const signUp = async (email: string, password: string) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password,
    );
    return userCredential.user;
  } catch (error) {
    throw error;
  }
};

export const signIn = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password,
    );
    return userCredential.user;
  } catch (error) {
    throw error;
  }
};

export const signOutUser = async () => {
  try {
    await signOut(auth);
    router.push("/");
  } catch (error) {
    throw error;
  }
};

export const checkUserLoggedIn = () => {
  auth.onAuthStateChanged((user) => {
    if (user === null) {
      router.push("/Login");
    }
    else
    {
      getUserToken();
      if(router.pathname === "/Login")
      {
        router.push("/Home")
      }
    }
  });
};

export const getUserToken = async () => {
  const user = auth.currentUser;
  if (user) {
    user.getIdToken().then((token) => {
      localStorage.setItem("firebaseToken", token);
    })
  }
};

export const onAuthStateChange = (callback: (user: any) => void) => {
  return onAuthStateChanged(auth, callback);
};
