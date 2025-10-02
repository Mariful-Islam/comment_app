// lib/firebase.ts
"use client";
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, FacebookAuthProvider } from "firebase/auth";


const firebaseConfig = {
  apiKey: "AIzaSyDQ96DEpUNJAGKoTTvHVc2BYFYklV91nHY",
  authDomain: "comment-app-d29e3.firebaseapp.com",
  projectId: "comment-app-d29e3",
  appId: "1:218755231661:web:af11f0acd9f128da037b24",
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const facebookProvider = new FacebookAuthProvider();

export { auth, provider, facebookProvider };
