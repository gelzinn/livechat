'use client'

export default function Error404() {
  if (typeof window !== 'undefined') {
    window.location.href = '/'
  }
}
