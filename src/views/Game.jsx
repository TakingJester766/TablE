import { useContractReader } from "eth-hooks";
import { ethers, utils } from "ethers";
import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { Account } from "../components";
import { Button, List, Input, Select, Radio } from "antd";
import { storeKeyNameFromField } from "@apollo/client/utilities";
import { Address, Balance, Events } from "../components";


/**
 * web3 props can be passed from '../App.jsx' into your local view component for use
 * @param {*} yourLocalBalance balance on current network
 * @param {*} readContracts contracts from current chain already pre-loaded using ethers contract module. More here https://docs.ethers.io/v5/api/contract/contract/
 * @returns react component
 **/
function Game({ 
    purpose,
    address,
    mainnetProvider,
    localProvider,
    yourLocalBalance,
    price,
    tx,
    readContracts,
    writeContracts,
}) {
  // you can also use hooks locally in your component of choice
  // in this case, let's keep track of 'purpose' variable from our contract

  const gameNumber = useContractReader(readContracts, "YourContract", "gameNumber");
  const [inputValue, setInputValue] = useState("");
  const buyinReq = useRef(0);
  const name = useRef("");
  const [gameName, setName] = useState("");
  const [gameId, setGameId] = useState("");
  const gameInput = useRef();
  const [withdrawalReq, setWithdrawalReq] = useState("");
  const req = useRef("");
  const [withdrawalGameId, setWithdrawalGameId] = useState("");
  const gameIdWithdrawals = useRef("");

  // For verifying wtihdrawal requests
  

  // Array for keeping track of players
  const players = ["0x59D101AD9DdeA84C0e11DA137000Dd91A0b20c79", "0x0165878A594ca255338adfa4d48449f69242Eb8F"];
  const playerMaps = players.map((player) =>
  <li><Account address={player} ensProvider={mainnetProvider} fontSize={16}/></li>
  );
  // Getter for game mapping


  function print() {
    console.log(utils.parseEther(gameId));
  }

  const num = 1;
  const gameId2 = 1;

  return (
    <div><br /> 
      <h1>Join a game</h1>
      <div>
        <Input
          style={{ width:"300px" }}
          placeholder="Name for game"
          type="text"
          value={gameName}
          name={name}
          onChange={(e) => setName(e.target.value)}>
        </Input>
        <br /><br />
        <Input
          style={{ width:"300px" }}
          placeholder="Amount to buyin with" 
          type="text"
          value={inputValue}
          name={buyinReq}
          onChange={(e) => setInputValue(e.target.value)}>
        </Input>
        <br /><br />
        <Input
          style={{ width:"300px" }}
          placeholder="Game id:"
          type="text"
          value={gameId}
          name={gameInput}
          onChange={(e) => setGameId(e.target.value)}>
        </Input>
        
        </div>
        <div>
          <Button
            style={{ marginTop: 8 }}
            onClick={async () => {        
              const result = tx(writeContracts.YourContract.buyin(gameName, gameId.toString(), utils.parseEther(`${inputValue.toString()}`), {value : utils.parseEther(`${inputValue.toString()}`)}
              ), update => {
                  console.log("📡 Transaction Update:", update);
                    if (update && (update.status === "confirmed" || update.status === 1)) {
                      console.log(" 🍾 Transaction " + update.hash + " finished!");
                      console.log(" ⛽️ " + update.gasUsed + "/" + (update.gasLimit || update.gas) + " @ " + parseFloat(update.gasPrice) / 1000000000 + " gwei");
                    } else {
                      return;
                    }
                    });
                    console.log("awaiting metamask/web3 confirm result...", result);
                    console.log(await result);
          }}>Join Game</Button>    
        </div>

        <br />

        <div>
          <h1>Make a Withdrawal Request</h1>

          <Input
            style={{ width:"300px" }}
            placeholder="Final value of original buyin"
            type="text"
            value={withdrawalReq}
            name={req}
            onChange={(e) => setWithdrawalReq(e.target.value)}>
          </Input>

          <Button
            style={{ marginTop: 8 }}
            onClick={async () => { 
              if (gameId == "") {
                alert('Make sute to pass in the id of the game you are referencing.');
                return;
              } else if (withdrawalReq == "") {
                alert("Enter your ending game total to proceed.");
                return;
              } else {      
              const result = tx(writeContracts.YourContract.addReq(gameId?.toString(), utils.parseEther(`${withdrawalReq?.toString()}`)
              ), update => {
                  console.log("📡 Transaction Update:", update);
                    if (update && (update.status === "confirmed" || update.status === 1)) {
                      console.log(" 🍾 Transaction " + update.hash + " finished!");
                      console.log(" ⛽️ " + update.gasUsed + "/" + (update.gasLimit || update.gas) + " @ " + parseFloat(update.gasPrice) / 1000000000 + " gwei");
                    } else {
                      return;
                    }});
                    console.log("awaiting metamask/web3 confirm result...", result);
                    console.log(await result);
          }}}>Add Request</Button>    


        </div>

           
        <div>

          <Button
            style={{ marginTop: 8 }}
            onClick={async () => {    
              if (gameId == null) {
                alert('Make sure to pass in the id of the game you are referencing.');
              } else { 
              const result = tx(writeContracts.YourContract.verifyRequests(gameId.toString()), update => {
                console.log("📡 Transaction Update:", update);
                if (update && (update.status === "confirmed" || update.status === 1)) {
                  console.log(" 🍾 Transaction " + update.hash + " finished!");
                  console.log(" ⛽️ " + update.gasUsed + "/" + (update.gasLimit || update.gas) + " @ " + parseFloat(update.gasPrice) / 1000000000 + " gwei");
                } else {
                  return;
                }});
            console.log("awaiting metamask/web3 confirm result...", result);
            console.log(await result);
          }}}>Verify Requests</Button>   
      </div>  
          <div>
            <Button
              style={{ marginTop: 8 }}
              onClick={async () => {    
                if (gameId == null) {
                  alert('Make sure to pass in the id of the game you are referencing.');
                } else { 
                const result = tx(writeContracts.YourContract.payout(gameId.toString()), update => {
                  console.log("📡 Transaction Update:", update);
                  if (update && (update.status === "confirmed" || update.status === 1)) {
                    console.log(" 🍾 Transaction " + update.hash + " finished!");
                    console.log(" ⛽️ " + update.gasUsed + "/" + (update.gasLimit || update.gas) + " @ " + parseFloat(update.gasPrice) / 1000000000 + " gwei");
                  } else {
                    return;
                  }});
              console.log("awaiting metamask/web3 confirm result...", result);
              console.log(await result);
            }}}>Payout</Button>
          </div>


           
           
           
           
            {/*
            <br />
          <div class="container">
            <ul class="leaderboard">{playerMaps}</ul>
                

                  </div>*/}







    </div>
  );
}

export default Game;