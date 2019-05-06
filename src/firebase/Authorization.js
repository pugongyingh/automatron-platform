import React, { useState, useEffect } from 'react'
import { FirebaseAuth } from './firebase'

/**
 * @param {object} props
 * @param {string} props.token
 */
export default function Authorization(props) {
  const [status, setStatus] = useState('Authorizing...')
  useEffect(() => {
    const run = async () => {
      try {
        const result = await FirebaseAuth.signInWithCustomToken(props.token)
        const firebaseUser = result.user
        if (!firebaseUser)
          throw new Error(
            'No user returned from FirebaseAuth.signInWithCustomToken',
          )
        setStatus('Welcome! ' + firebaseUser.displayName)
      } catch (error) {
        setStatus(`Failed to authorize: ${error}`)
      }
    }
    run()
  }, [])
  return <div>{status}</div>
}
