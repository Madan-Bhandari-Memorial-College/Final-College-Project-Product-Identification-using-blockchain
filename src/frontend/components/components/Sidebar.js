import React, { useState } from "react";
import styled from "styled-components";
import { navItems } from "../static/navItems";
import { Navbar, Nav, Button, Container } from 'react-bootstrap'
import {
    Link
} from "react-router-dom";

const SideBar = () => {
  const [activeIcon, setActiveIcon] = useState(navItems[0].title);
  return (
    <Wrapper>
      <LogoContainer>
        <Logo>
          
        </Logo>
      </LogoContainer>
      <NavItemsContainer>
        {navItems.map((item, index) => (
            <Nav className="me-auto">
            <Nav.Link as={Link} to={item.to}>
          <NavItem key={index} onClick={() => setActiveIcon(item.title)}>
            <NavIcon style={{ color: item.title === activeIcon && "#3773f5" }}>
              {item.icon}
            </NavIcon>
            <NavTitle>{item.title}</NavTitle>
          </NavItem>
          </Nav.Link>
          </Nav>
        ))}
      </NavItemsContainer>
    </Wrapper>
  );
};

export default SideBar;

const Wrapper = styled.div`
  height: calc(100vh);
  border-right: 1px solid #282b2f;
  width: calc(22rem - 16px - 16px);
  padding: 0 1rem;
`;

const LogoContainer = styled.div`
  margin: 1.5rem 0;
`;

const Logo = styled.div`
  width: 44%;
  object-fit: contain;
  margin-left: 1.5rem;
`;

const NavItemsContainer = styled.div`
  margin-top: 3rem;
  &:hover {
    cursor: pointer;
  }
`;

const NavItem = styled.div`
  display: flex;
  align-items: center;
  font-size: 1.3rem;
  font-weight: 500;
  border-radius: 0.5rem;
  margin-bottom: 1.5rem;
  height: 4rem;
  color: white;
  &:hover {
    background-color: #141519;
  }
`;

const NavIcon = styled.div`
  background-color: #141519;
  padding: 0.7rem;
  border-radius: 50%;
  margin: 0 1rem;
  display: grid;
  place-items: center;
`;

const NavTitle = styled.div``;