import React from 'react';
import { css } from '@emotion/css';

type StackProps = {
  spacing: number;
  children: React.ReactNode;
};

export function VStack({ spacing, children }: StackProps) {
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
  );
}
