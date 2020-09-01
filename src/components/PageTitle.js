import React from 'react';
import './PageTitle.scss';

function PageTitle({ children }) {
  return <h1 className="page-title">{children}</h1>;
}

export default PageTitle;
