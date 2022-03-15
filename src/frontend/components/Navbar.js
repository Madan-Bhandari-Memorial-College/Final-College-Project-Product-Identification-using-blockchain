import {
    Link
} from "react-router-dom";
import { Navbar, Nav, Button, Container } from 'react-bootstrap'
import market from './logo.png'

import React from "react";
import styled from "styled-components";

const Navigationbar = styled.div`
  position: sticky;
  top: 0;
  bottom: 0;
  width: 100%;
  z-index: 9;
  background-color: #000;
`;
const NavHead = styled.div`
  padding: 10px 10vw;
  display: flex;
  justify-content: space-between;
`;
const Logo = styled.img`
  height: 60px;
  width: 300px;
`;

const NavbarItem = styled.div`
display: flex;
  align-items: center;
  a{
    margin-left: 20x;
  }
  a img{
    width: 30px;
    height: 2em;
    margin: 0 8px;
  }
}
`;
const Search = styled.div`
  width: 500px;
  display: flex;
`;
const SearchBox = styled.input`
  width: 80%;
  height: 40px;
  padding: 10px;
  border-top-left-radius: 10px;
  border-bottom-left-radius: 10px;
  border: 1px solid #d1d1d1;
  text-transform: capitalize;
  background: none;
  color: #a9a9a9;
  outline: none;
  &::placeholder {
    color: #a9a9a9;
  }
`;
const SearchBtn = styled.button`
  width: 20%;
  height: 40px;
  border: none;
  outline: none;
  cursor: pointer;
  background: #383838;
  border-top-right-radius: 10px;
  color: white;
  border-bottom-right-radius: 10px;
`;



const Navigation = ({ web3Handler, account }) => {
  return (
    <Navigationbar>
      <NavHead>
        <h1><Nav.Link as={Link} className="text-white" to="/">PIB</Nav.Link></h1>
        <NavbarItem>
          <Search>
            <SearchBox
              Id="searchBar"
              type="text"
              placeholder="Search product"
            />
            <SearchBtn Id="searchBtn">Search</SearchBtn>
          </Search>
          <Nav.Link as={Link} to="/" id="products" className="text-white">
            Products
          </Nav.Link>
          {account ? (
                <>
                <Nav.Link to="/dashboard" as={Link} className="text-white">Dashboard</Nav.Link>

                <Nav.Link
                    href={`https://etherscan.io/address/${account}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="button nav-button btn-sm mx-4">
                    <Button variant="outline-light">
                        {account.slice(0, 5) + '...' + account.slice(38, 42)}
                    </Button>

                </Nav.Link>
                </>
            ) : (
                <Button onClick={web3Handler} variant="outline-light">Connect Wallet</Button>
            )}
          
        </NavbarItem>
      </NavHead>
    </Navigationbar>
  );
}


export default Navigation;