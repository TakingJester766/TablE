import { ethers, utils } from "ethers";
import React, { useState, useRef } from "react";
import { Button, Input, Select, Radio } from "antd";
import { useContractReader } from "eth-hooks";


export default function StartGame({
    readContracts,
    writeContracts,
    tx
}) {

    const [inputValue, setInputValue] = useState("");
    const [gameId, setGameId] = useState("");

    const buyinReq = useRef(0);
    const gameInput = useRef("Loading...");    

    const name = useRef("");
    const [gameName, setName] = useState("");

    const gameNumber = useContractReader(readContracts, "YourContract", "gameNumber");

    function print() {
        console.log(gameNumber);
    }

    

    return (
        <div>
            <Input
                style={{ width:"300px" }}
                placeholder="Name for game"
                type="text"
                value={gameName}
                name={name}
                onChange={(e) => setName(e.target.value)}>
            </Input>
                <br />
                <br />
            <Input
                style={{ width:"300px" }}
                placeholder="Minimum game buyin" 
                type="primary"
                value={inputValue}
                name={buyinReq}
                onChange={(e) => setInputValue(e.target.value)}>
            </Input>
                <br />
                <br />
            <Button
                type="primary"
                style={{ marginTop: 8 }}
                onClick={async () => {                      
                if (inputValue == null || inputValue == 0) {
                    alert("Make sure to complete all fields before starting the game.");
                    return;
                } else {
                    const result = tx(writeContracts.YourContract.initializeGame(gameName, utils.parseEther(`${inputValue.toString()}`), {value: 1000000000000000}), update => {
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
  );
}
            {/*<button onClick={print}>Print</button>*/}    
