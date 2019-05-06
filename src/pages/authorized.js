import React, { useState, useEffect } from 'react'
import { FirebaseAuth } from '../firebase'
import { func } from 'prop-types'

/** @type {string | undefined} */
let savedToken

export default () => <AuthorizationPage />

function AuthorizationPage() {
  const [loaded, setLoaded] = useState(false)
  useEffect(() => {
    setLoaded(true)
  }, [])
  if (!loaded) {
    return <div>Loading...</div>
  }
  const match =
    typeof window !== 'undefined' &&
    window.location.hash.match(/login_token=([^&#]+)/)
  if (match) {
    const token = match[1]
    savedToken = token
    return <Authorization token={token} />
  } else {
    return <div>Error: No token received!</div>
  }
}

/**
 * @param {object} props
 * @param {string} props.token
 */
function Authorization(props) {
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
        const tokenResult = await firebaseUser.getIdTokenResult()
        setStatus('Welcome! ' + tokenResult.claims.displayName)
      } catch (error) {
        setStatus(`Failed to authorize: ${error}`)
      }
    }
    run()
  }, [])
  return <div>{status}</div>
}
