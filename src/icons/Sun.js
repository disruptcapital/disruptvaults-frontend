import styled from 'styled-components';
import { Sun } from '@styled-icons/fa-solid';

const StyledSun = styled(Sun)`
  height: 28px;
  width: 28px;
  color: ${({ theme }) => theme.text};
  cursor: pointer;
`;

const SunIcon = (props) => {
  return <StyledSun />;
};

export default SunIcon;
