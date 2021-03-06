import base from './base';

const lightColors = {
  nav: '#1266f1',
  text: '#4F4F4F',
  secondaryText: '#5f6368',
  bg: 'rgba(237, 237, 237, 0.5)',
  bgSecondary: '#FFFFFF',
  toastBorder: 'rgba(0, 0, 0, 0.3)',
  disabledBg: '#cdcdcd',
};

const light = {
  name: 'light',
  ...base,
  ...lightColors,
};

export default light;
