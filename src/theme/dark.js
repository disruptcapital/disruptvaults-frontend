import base from './base';

const darkColors = {
  nav: '#1266f1',
  text: '#E8EAED',
  secondaryText: '#9aa0a6',
  bg: '#202124',
  bgSecondary: '#292a2d',
  toastBorder: 'rgba(255, 255, 255, 0.3)',
};

const dark = {
  name: 'dark',
  ...base,
  ...darkColors,
};

export default dark;
