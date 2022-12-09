import styled from 'styled-components';

interface propsType {
  centerText: string;
}

export default function NavbarTextOnly({ centerText }: propsType) {
  return (
    <NavLayout>
      <CenterSpan>{centerText}</CenterSpan>
    </NavLayout>
  );
}

const NavLayout = styled.nav`
  position: fixed;
  max-width: 480px;
  height: 55px;
  left: 0;
  right: 0;
  top: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 5px 20px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.grey1};
  background-color: #fff;
  z-index: 2;
`;

const CenterSpan = styled.span`
  font-size: 16px;
`;
