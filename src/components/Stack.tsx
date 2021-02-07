import React from 'react'
import { css } from '@emotion/css'

type StackProps = {
  spacing: number
  children: React.ReactNode
}

export function VStack(props: StackProps) {
  const { spacing, children } = props
  return (
    <div
      className={css`
        & > * {
          margin-bottom: ${spacing}px;
        }
        & > *:last-child {
          margin-bottom: 0;
        }
      `}
    >
      {children}
    </div>
  )
}

export function HStack(props: StackProps) {
  const { spacing, children } = props
  return (
    <div
      className={css`
        & > * {
          margin-right: ${spacing}px;
        }
        & > *:last-child {
          margin-right: 0;
        }
      `}
    >
      {children}
    </div>
  )
}
