import styled from 'styled-components';
import { UserCircle } from '@styled-icons/fa-solid';

const LoggedOutIcon = (props) => {
  // from props.
  const fill = '#4f4f4f';
  //color: ${({ theme }) => theme.alert.background};

  const StyledLoggedOut = styled(UserCircle)`
    height: 32px;
    width: 32px;
    color: #cdcdcd;
  `;

  return <StyledLoggedOut />;
};

export default LoggedOutIcon;
