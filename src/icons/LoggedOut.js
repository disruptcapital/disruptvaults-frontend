import styled from 'styled-components';
import { UserCircle } from '@styled-icons/fa-solid';
const StyledLoggedOut = styled(UserCircle)`
  height: 32px;
  width: 32px;
  color: #cdcdcd;
`;
const LoggedOutIcon = (props) => {
  return <StyledLoggedOut />;
};

export default LoggedOutIcon;
