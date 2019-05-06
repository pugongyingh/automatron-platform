import firebase from '@firebase/app'

import 'firebase/database'
import 'firebase/auth'

/// <reference types="@firebase/database-types" />
/// <reference types="@firebase/auth-types" />

var firebaseConfig = {
  apiKey: 'AIzaSyAz2bA96ak8NXHm3rwFFOzigot3kTEa1Wk',
  authDomain: 'automatron-platform.firebaseapp.com',
  databaseURL: 'https://automatron-platform.firebaseio.com',
  projectId: 'automatron-platform',
  storageBucket: 'automatron-platform.appspot.com',
  messagingSenderId: '743193302050',
  appId: '1:743193302050:web:7d1458ff3626f7be',
}

firebase.initializeApp(firebaseConfig)

/** @type {import('firebase').auth.Auth} */
// @ts-ignore
export const FirebaseAuth = firebase.auth()
