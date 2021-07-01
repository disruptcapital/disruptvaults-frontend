import { createGlobalStyle } from 'styled-components';

export const GlobalStyles = createGlobalStyle`
  *,
  *::after,
  *::before {
    box-sizing: border-box;
  }

  body {
    align-items: center;
    background-color: ${({ theme }) => theme.bg};
    color: ${({ theme }) => theme.text};
    height: 100vh;
    margin: 0;
    padding: 0;
    font-family: Fira Sans, sans-serif !important;
    transition: all 0.25s linear;
  }
  
  .Toastify__toast {
    background-color: ${({ theme }) => theme.bgSecondary};
    color: ${({ theme }) => theme.text};
    border: 1px solid;
    border-color: ${({ theme }) => theme.toastBorder};
  }
  
  .Toastify__close-button--default {
    color: ${({ theme }) => theme.text};
  }

  .Toastify__toast-container--top-right {
    top: 75px !important;
  }
  `;
