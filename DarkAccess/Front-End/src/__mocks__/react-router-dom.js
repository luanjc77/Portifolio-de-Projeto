import React from 'react';

const MemoryRouter = ({ children }) => <div>{children}</div>;
const useNavigate = () => jest.fn();
const Link = ({ children, to, ...props }) => <a href={to} {...props}>{children}</a>;
const NavLink = ({ children, to, ...props }) => <a href={to} {...props}>{children}</a>;
const useLocation = () => ({ pathname: '/', search: '', hash: '', state: null });
const useParams = () => ({});

module.exports = {
  MemoryRouter,
  BrowserRouter: MemoryRouter,
  useNavigate,
  Link,
  NavLink,
  useLocation,
  useParams,
  __esModule: true,
};
