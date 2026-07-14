import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, updateDoc, doc, query, where } from "firebase/firestore";
import fs from 'fs';
import dotenv from 'dotenv';
dotenv.config();

// Read firebase config from somewhere? Or we can just use the admin sdk.
