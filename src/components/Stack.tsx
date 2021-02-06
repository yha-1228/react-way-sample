import { css } from '@emotion/css';
import React from 'react';

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
