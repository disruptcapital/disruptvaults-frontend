import styled from 'styled-components';
import { Moon } from '@styled-icons/fa-solid';

const StyledMoon = styled(Moon)`
  height: 28px;
  width: 28px;
  color: ${({ theme }) => theme.text};
  cursor: pointer;
`;
const MoonIcon = (props) => {
  return <StyledMoon />;
};

export default MoonIcon;
