import { useContractReader } from "eth-hooks";
import { ethers, utils, getAddress } from "ethers";
import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { Button, Input, Select, Radio } from "antd";
import { useEffect } from "react";
import { QrCode, Address, Account, Events } from "../components";
import { useHistory } from "react-router-dom";




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
    writeContracts
}) {

    const senderInfo = useContractReader(writeContracts, "YourContract", "getPlayerInfo");
    

  /*string name; 0
    uint gameId; 1
    uint buyinAmount; 2
    uint withdrawalAmount; 3
    bool withdrawalReq; 4
    bool verifyReqs; 5
    bool hasWithdrawn; 6
    bool isInGame; 7
    bool isHost; 8*/

    // Player info ------------------------------------------------------------------------------------------------------------------------

    function getGameStatus() {
      if (senderInfo == null || senderInfo[8] == null || senderInfo[8] == false) { // playerInfo[7] meaning that msg.sender IS host
        return false;
      } else {
        return true;
      }
    }

    function getPlayerId() {
      if (senderInfo == null || senderInfo[1] == null) {
        return 0;
      } else {
         return senderInfo[1];
      }
    }

    function getName() {
      if (senderInfo == null) {
        return "test is undefined.";
      } else if (senderInfo[0] == null) { // test[0] is the name variable in the struct
        return "noName";
      } else {
        return senderInfo[0]?.toString();
      }
    }



    // Game info --------------------------------------------------------------------------------------------------------------------------

    //const gameInfo = useContractReader(readContracts, "YourContract", "getGameInfo", address);

  /*
    address host; 0
    uint gameId; 1
    uint buyinRequirement; 2
    uint etherWithdrawalReqs; 3        
    uint gamePot; 4
    uint8 tableWithdrawalReqs; 5
    uint8 playerCount; 6
    uint8 verifiedWithdrawalReqs; 7
    bool endedBuyin; 8
    */

    /*function getMinBuyin() {
      if (gameInfo == null || gameInfo[2] == null) {
        return 1;
      } else {
         return gameInfo[2];
      }
    } */

    const gameNumber = useContractReader(readContracts, "YourContract", "gameNumber");

    const [inputValue, setInputValue] = useState("");
    const [gameId, setGameId] = useState("");

    const buyinReq = useRef(0);
    const gameInput = useRef("Loading...");    

    const name = useRef("");
    const [gameName, setName] = useState("");

    //const [data, setData] = useState("");
    
    const [isStarted, setIsStarted] = useState(false);

    // For dropdown

    const [isShown, setIsShown] = useState(false);

    const handleClick = event => {
        // 👇️ toggle shown state
        setIsShown(current => !current);
    
        // 👇️ or simply set it to true
        // setIsShown(true);
    };

    const history = useHistory();

    function joinGame() {
      history.push("/Game");
    }
    

    return (
        <div>
            
            <br />
            <h1>Host a game</h1>
            {/*<h1>Current game number: {gameNumber?.toString()}</h1>*/}
              
          

            {getGameStatus() ? 
            <div>
              <QrCode />

              <Button
                type="primary"
                style={{ marginTop: 8 }}
                onClick={joinGame}
              >Join Game</Button>


            {/*string memory name, uint inputId, uint buyinAmount


            <Button
              type="primary"
              style={{ marginTop: 8 }}
              onClick={async () => {       
                const result = tx(writeContracts.YourContract.buyin(getName().toString(), getPlayerId.toString(), utils.parseUnits(`1`).toString(), {value : utils.parseUnits(`1`).toString()}
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
              }
          }>Join Your Game with Minimum Buyin</Button>*/}

              {/*Join game with exact buyin and stats?*/}

              




            </div>
            : 

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
                        const result = tx(writeContracts.YourContract.startGame(gameName, utils.parseEther(`${inputValue.toString()}`), {value: 1000000000000000}), update => {
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
            
            
            
            
            }

            <br />           
            



        </div>
    )
}

export default HostGame;

/*
function print() {
    console.log(account)
}

<Button onClick={print}>Print</Button>
<Button onClick={print()}></Button>

<Button
              onClick={() => {
                tx(writeContracts.YourContract.isInGame(address));                
              }}
            >
              Print PlayerInfo
            </Button>

            <Button onClick={printType}>Address</Button>

*/

