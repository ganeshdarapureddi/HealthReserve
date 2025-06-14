'use client'

import { useEffect } from 'react'
import styles from './global-error.module.css'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Global error:', error)
  }, [error])

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>Something went wrong globally!</h2>
      <p className={styles.message}>{error.message}</p>
      <button onClick={() => reset()} className={styles.button}>
        Try again
      </button>
    </div>
  )
}
