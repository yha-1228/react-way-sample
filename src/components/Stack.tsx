import React from 'react';
import { css } from '@emotion/css';

type VStackProps = {
  spacing: number;
  children: React.ReactNode;
};

export default function VStack({ spacing, children }: VStackProps) {
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
