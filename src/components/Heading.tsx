import React from 'react';
import './Heading.scss';

type HeadingProps = { children: React.ReactNode };

export default function Heading({ children }: HeadingProps) {
  return <h1 className="heading">{children}</h1>;
}
