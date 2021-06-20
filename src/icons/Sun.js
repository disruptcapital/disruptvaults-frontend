import styled from 'styled-components';
import { Sun } from '@styled-icons/fa-solid';

const SunIcon = (props) => {
  // from props.
  const fill = '#4f4f4f';
  //color: ${({ theme }) => theme.alert.background};

  const StyledSun = styled(Sun)`
    height: 32px;
    width: 32px;
    color: #4f4f4f;
    cursor: pointer;
  `;

  return <StyledSun />;
};

export default SunIcon;
