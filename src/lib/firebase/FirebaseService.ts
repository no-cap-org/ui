// Import the functions you need from the SDKs you need
import { FirebaseApp, initializeApp } from "firebase/app";
import { Database, getDatabase } from "firebase/database";
import { Firestore, getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

export class FirebaseService{

  private static instance: FirebaseService | undefined;
  private app: FirebaseApp;

  constructor(){ 
    const firebaseConfig = {
      apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
      authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
      projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
      storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
      appId: import.meta.env.VITE_FIREBASE_APP_ID,
      databaseUrl: import.meta.env.VITE_FIREBASE_DATABASE_URL
    };
    

    this.app = initializeApp(firebaseConfig);

  }

  static getInstance(): FirebaseService{
    if(!this.instance){
      this.instance = new FirebaseService();
    }

    return this.instance;
    
  }

  getApp(): FirebaseApp{
    return this.app;
  }

  getRealtimeDB(): Database {
    return getDatabase(this.app)
  }

  getFireStoreDB(): Firestore {
    return getFirestore(this.app)
  } 

}