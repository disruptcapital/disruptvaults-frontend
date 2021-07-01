import React from 'react';
import { MDBCardImage } from 'mdb-react-ui-kit';
import styled from 'styled-components';
import { StyledSecondary } from 'components/Styled';

const StyledVaultHeader = styled.div`
  display: flex !important;
  align-items: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 4px 12px 0 rgb(0 0 0 / 7%), 0 2px 4px rgb(0 0 0 / 5%);
`;

const StyledCardImage = styled(MDBCardImage)`
  width: 80px;
  height: 80px;
`;

const VaultHeader = (props) => {
  const { pool = {}, tvl } = props;
  const { logo, name, tokenDescription } = pool;
  return (
    <StyledVaultHeader>
      <div className="m-2">
        <StyledCardImage className="img-fluid" overlay="white-light" hover src={`${process.env.PUBLIC_URL}/${logo}`} />
      </div>
      <div style={{ flexGrow: '1' }}>
        <h5 className="mt-2 mb-0 font-weight-bold">{name}</h5>
        <StyledSecondary className="mb-2">Uses: {tokenDescription}</StyledSecondary>
        <div className="d-flex justify-content-evenly">
          <div>
            <div>999.99%</div>
            <StyledSecondary align="center">APY</StyledSecondary>
          </div>
          <div>
            <div>999.99%</div>
            <StyledSecondary align="center">Daily</StyledSecondary>
          </div>
          <div>
            <div>{tvl}</div>
            <StyledSecondary align="center">TVL</StyledSecondary>
          </div>
        </div>
      </div>
    </StyledVaultHeader>
  );
};

export default VaultHeader;
