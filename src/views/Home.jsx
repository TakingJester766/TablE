import { Button, Input, Select, Radio, Title } from "antd";
import { useContractReader } from "eth-hooks";
import { ethers, utils } from "ethers";
import React, { useState, useRef, useCallback } from "react";
import { useHistory } from "react-router-dom";
import { Address, Balance, Events } from "../components";
import diamond from '../themes/images/diamond.png';
import moneybag from '../themes/images/moneybag.png';

const {Option} = Select;


/**
 * web3 props can be passed from '../App.jsx' into your local view component for use
 * @param {*} yourLocalBalance balance on current network
 * @param {*} readContracts contracts from current chain already pre-loaded using ethers contract module. More here https://docs.ethers.io/v5/api/contract/contract/
 * @returns react component
 **/

function Home({ 
  address,
  mainnetProvider,
  localProvider,
  yourLocalBalance,
  price,
  tx,
  readContracts,
  writeContracts, }) {
  
  // you can also use hooks locally in your component of choice
  // in this case, let's keep track of 'purpose' variable from our contract

  // gameNumber import ---------------------------------------------------------------------------------------------

  const gameNumber = useContractReader(readContracts, "YourContract", "gameNumber");
 
  const history = useHistory();

  // ---------------------------------------------------------------------------------------------------------------
  
  return (
    <div>  
      <div className="flex-container">
        <h1><img className="diamond" src={diamond} alt="card" />TablΞ</h1>
      </div>
      <h4 id="grey">The best place to make and lose money against your friends.</h4>
      <br/>{/*
        <Button a href='/HostGame'>Host a Game</Button>
  <br/><br/>*/}

      <div className="main-content">

        

        <img className="moneybag" src={moneybag} alt="money-bag"/>
      </div>







    </div>
  );
}

export default Home;

/*











*/