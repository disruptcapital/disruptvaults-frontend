import styled from 'styled-components';
import { Moon } from '@styled-icons/fa-solid';

const MoonIcon = (props) => {
  // from props.
  const fill = '#4f4f4f';
  //color: ${({ theme }) => theme.alert.background};

  const StyledMoon = styled(Moon)`
    height: 32px;
    width: 32px;
    color: #4f4f4f;
    cursor: pointer;
  `;

  return <StyledMoon />;
};

export default MoonIcon;
