import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/database';
import 'firebase/compat/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDkeHAhEumbOagQN88GE88DHIZzs1-pWTQ",
  authDomain: "projeto-bd-ii-441c1.firebaseapp.com",
  projectId: "projeto-bd-ii-441c1",
  storageBucket: "projeto-bd-ii-441c1.firebasestorage.app",
  messagingSenderId: "989699363739",
  appId: "1:989699363739:web:2ce250e7f7caa1d936c73e",
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

// Estas três linhas com "export" são o que o React estava sentindo falta para a tela voltar a funcionar:
export const auth = firebase.auth();
export const db = firebase.database();
export const firestore = firebase.firestore();