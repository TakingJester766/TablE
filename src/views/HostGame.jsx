import { useContractReader } from "eth-hooks";
import { ethers, utils } from "ethers";
import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { Button, Input, Select, Radio } from "antd";
import { useEffect } from "react";

/**
 * web3 props can be passed from '../App.jsx' into your local view component for use
 * @param {*} yourLocalBalance balance on current network
 * @param {*} readContracts contracts from current chain already pre-loaded using ethers contract module. More here https://docs.ethers.io/v5/api/contract/contract/
 * @returns react component
 **/
function HostGame({
    address,
  mainnetProvider,
  localProvider,
  yourLocalBalance,
  price,
  tx,
  readContracts,
  writeContracts,
}) {

    const gameNumber = useContractReader(readContracts, "YourContract", "gameNumber");

    const [inputValue, setInputValue] = useState("");
    const [gameId, setGameId] = useState("");

    const buyinReq = useRef(0);
    const gameInput = useRef("Loading...");



    return (
        <div>
            <h1>Host a game</h1>
            <h1>Current game number: {gameNumber?.toString()}</h1>
            <div>
                <Input
                    style={{ width:"300px" }}
                    placeholder="Minimum game buyin" 
                    type="text"
                    value={inputValue}
                    name={buyinReq}
                    onChange={(e) => setInputValue(e.target.value)}>
                </Input>
                
                <Button
                    style={{ marginTop: 8 }}
                    onClick={async () => {                      
                        if (inputValue == null || inputValue == 0) {
                            alert("Make sure to set the minimum buyin before starting the game.");
                            return;
                        } else {
                        const result = tx(writeContracts.YourContract.initializeGame(utils.parseEther(`${inputValue.toString()}`), {value: 1000000000000000}), update => {
                            console.log("📡 Transaction Update:", update);
                            if (update && (update.status === "confirmed" || update.status === 1)) {
                            console.log(" 🍾 Transaction " + update.hash + " finished!");
                            console.log(" ⛽️ " + update.gasUsed + "/" + (update.gasLimit || update.gas) + " @ " + parseFloat(update.gasPrice) / 1000000000 + " gwei");
                            console.log(`New game initialize: requirement of ${inputValue} ether at a gameId of ${gameNumber}`);
                        }
                        });
                        console.log("awaiting metamask/web3 confirm result...", result);
                        console.log(await result);
                    }}}>Start New Game</Button>              
            </div>  
            <br/>
            <div>
                <Input
                    style={{ width:"300px" }}
                    placeholder="Game id:"
                    type="text"
                    value={gameId}
                    name={gameInput}
                    onChange={(e) => setGameId(e.target.value)}>
                </Input>
                    
                <Button
          style={{ marginTop: 8 }}
          onClick={async () => {     
          {/* Function I am having some trouble with: 
            
          Basically, in the case I initialize a game with a required buyin of 1 ether, I hardcoded the 
          button function below so that when clicked, it should work, due to "10000000000000000000" being 
          >= to the buyinRequirement I have set. Not sure what the deal is, as well as why the second 
          param works as just 1, where I need to have a big number in the third.
            
        
        */}    
            const result = tx(writeContracts.YourContract.terminateBuyin(gameId.toString()
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
                    }}>End Buyin for Game {gameId}</Button>


            </div>





        </div>
    )
}

export default HostGame;

/*<button onClick={print}>Print</button>      
function print() {
    console.log(inputValue);
}
*/