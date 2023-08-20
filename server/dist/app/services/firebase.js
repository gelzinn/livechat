"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const firestore_1 = require("firebase/firestore");
const app_1 = require("firebase/app");
const firebaseConfig = {
    apiKey: "AIzaSyBF8Pg8CpiZaRcLgJQhwRwbfHkiEGgMPn4",
    authDomain: "loopchatdb.firebaseapp.com",
    databaseURL: "https://loopchatdb-default-rtdb.firebaseio.com",
    projectId: "loopchatdb",
    storageBucket: "loopchatdb.appspot.com",
    messagingSenderId: "1057305755445",
    appId: "1:1057305755445:web:e716adcce4db4d85af567c",
};
const app = (0, app_1.initializeApp)(firebaseConfig);
const db = (0, firestore_1.getFirestore)(app);
exports.default = db;
