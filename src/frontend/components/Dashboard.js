import Main from "./components/Main";
import React, { useState } from "react";
import styled from "styled-components";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import Web3 from 'web3';


const Dashboard = ({ address, account }) => {
  const [balance, setBalance] = useState(0);
  let web3 = new Web3(window.ethereum);
  web3.eth.getBalance(account).then((value) => setBalance(web3.utils.fromWei(value, 'ether')));

  return (
    <Wrapper>
      <Sidebar />
      <MainContainer>
        {/* <Header walletAddress={address} /> */}
        <Main balance={balance} />
      </MainContainer>
    </Wrapper>
  );
};

export default Dashboard;

const Wrapper = styled.div`
  display: flex;
  height: 100vh;
  width: 100vw;
  background-color: #0a0b0d;
  color: white;
  overflow: hidden;
`;

const MainContainer = styled.div`
  flex: 1;
`;