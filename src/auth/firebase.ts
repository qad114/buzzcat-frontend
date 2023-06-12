import { initializeApp } from 'firebase/app';
import { createUserWithEmailAndPassword, getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut, User as FirebaseUser } from 'firebase/auth';

export const app = initializeApp({
  apiKey: "AIzaSyA8ADGi_FmSnkS9diL0ByiiuCVizE9ZKyk",
  authDomain: "buzzcat-98300.firebaseapp.com",
  projectId: "buzzcat-98300",
  storageBucket: "buzzcat-98300.appspot.com",
  messagingSenderId: "390507808069",
  appId: "1:390507808069:web:8f669d7accc077ebc2aa2c"
});

const auth = getAuth(app);

export const emailSignIn = async (email: string, password: string) => {
  await signInWithEmailAndPassword(auth, email, password);
}

export const emailSignOut = async () => {
  await signOut(auth);
}

export const emailSignUp = async (email: string, password: string) => {
  await createUserWithEmailAndPassword(auth, email, password);
}

let fbUser: FirebaseUser | null = null;

let emailSignInListener: (user: FirebaseUser) => void;
let emailSignOutListener: () => void;

export const onEmailSignIn = (listener: (user: FirebaseUser) => void) => {
  emailSignInListener = listener;
};

export const onEmailSignOut = (listener: () => void) => {
  emailSignOutListener = listener;
};

onAuthStateChanged(auth, async user => {
  fbUser = user;
  if (user) {
    emailSignInListener(user);
  } else {
    emailSignOutListener();
  }
});

export const getToken = async () => {
  if (fbUser) return await fbUser.getIdToken();
}