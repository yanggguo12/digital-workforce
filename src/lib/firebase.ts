import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { initializeFirestore, collection, doc, getDoc, getDocs, getDocsFromServer, getDocFromServer, setDoc, addDoc, updateDoc, deleteDoc, query, where, serverTimestamp, onSnapshot, orderBy, limit, Timestamp, increment } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);
export const db = initializeFirestore(app, { 
  experimentalForceLongPolling: true
}, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export const signInWithGoogle = () => signInWithPopup(auth, googleProvider);

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  }
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  }
  if (!auth.currentUser) {
    console.warn('Demo Mode: Firestore operations are disabled because you are using a mock login.', error);
    return;
  }

  process.env.NODE_ENV !== 'production' && console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

export { 
  collection, 
  doc, 
  getDoc, 
  getDocs,
  getDocsFromServer,
  getDocFromServer,
  setDoc, 
  addDoc, 
  updateDoc,
  deleteDoc,
  query, 
  where, 
  serverTimestamp,
  onSnapshot,
  orderBy,
  limit,
  Timestamp,
  increment
};

// Test connection strictly
async function testFirestoreConnection() {
  try {
    // We use a small timeout check
    await getDocFromServer(doc(db, '_connection_test_', 'ping'));
    console.log("Firestore connection established successfully.");
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.error("Firestore is offline. Please check your network or firewall settings.");
    } else {
      console.warn("Firestore connection test completed with status:", error);
    }
  }
}
testFirestoreConnection();
