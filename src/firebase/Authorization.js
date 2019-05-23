import React, { useState, useEffect } from 'react'
import { FirebaseAuth } from './firebase'
import { navigate } from 'gatsby'

/**
 * @param {object} props
 * @param {string} props.token
 * @param {string} props.to
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
        setTimeout(() => {
          if (props.to === 'share') {
            navigate('/sharing')
          } else {
            navigate('/editor')
          }
        })
      } catch (error) {
        setStatus(`Failed to authorize: ${error}`)
      }
    }
    run()
  }, [])
  return <div>{status}</div>
}
