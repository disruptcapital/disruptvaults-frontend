import styled from 'styled-components';

export const StyledSecondary = styled.div`
    font-size: 13px;
    color: ${({ theme }) => theme.secondaryText};
    text-align: ${props => props.align ? props.align : "left"};
`;