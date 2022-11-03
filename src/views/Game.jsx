import { useContractReader } from "eth-hooks";
import { ethers, utils } from "ethers";
import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { Button, Input, Table, Space, Tag, Spin  } from "antd";
import { storeKeyNameFromField } from "@apollo/client/utilities";
import { Account, Address, Balance, Events } from "../components";
import { local } from "web3modal";


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
    Player
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

  // Getter functions for player and game info ----------------------------------------------------------------------

  const gameInfo = useContractReader(readContracts, "YourContract", "getGameInfo", "1");

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
    bool isActive; 9 
    address[] playerList; 10
    */

  //const host = gameInfo[0];

      // Get info for msg.sender -------------------------------------------------------------------------------------------------------------

  const playerInfo = useContractReader(writeContracts, "YourContract", "getPlayerInfo"); // Getter for msg.sender info

  /*string name; 0
    uint gameId; 1
    uint buyinAmount; 2
    uint withdrawalAmount; 3
    bool withdrawalReq; 4
    bool verifyReqs; 5
    bool hasWithdrawn; 6
    bool isInGame; 7
    bool isHost; 8*/

    function getName() {
      if (playerInfo == null) {
        return "playerInfo is undefined.";
      } else if (playerInfo[0] == null) {
        return "noName";
      } else {
        return playerInfo[0].toString();
      }
    }

    function getBuyinAmount() {
      if (playerInfo == null || playerInfo[2] == null) {
        return "0";
      } else {
        return utils.formatEther(playerInfo[2].toString());
      }
    }


    function getGameStatus() {
      if (playerInfo == null || playerInfo[7] == null || playerInfo[7] == false) {
        return true;
      } else {
        return false;
      }
    }

    function getPlayerId() {
      if (playerInfo == null || playerInfo[1] == null) {
        return 0;
      } else {
        return playerInfo[1];
      }
    }

    function getHostStatus() {
      if (playerInfo == null || playerInfo[7] == false) {
        return "Not in game";
      } else if (playerInfo[8] == false) {
        return "Member";
      } else if (playerInfo[8] == true) {
        return "host";
      }
    }

    // Get info for other players ------------------------------------------------------------------------------------------------------------    

    function getSpecPlayer(index) { // For returning a specific player address from the players array
      if (gameInfo == null) {
        return "gameInfo not defined";
      } else if (gameInfo[10].length == 0) {
        return "Nobody home!";
      } else if (0 > gameInfo[10].length - 1) {
        return "index out of bounds!";
      } else {
        return gameInfo[10][index]?.toString();
      }
    } 

    
    const otherPlayerInfo = useContractReader(writeContracts, "YourContract", "getOtherPlayerInfo", [getSpecPlayer(0)]); // Getter for other players based on address input
    

    function getOtherPlayerName() {
      if (otherPlayerInfo == null) {
        return "otherPlayerInfo is undefined."
      } else if (otherPlayerInfo == null) {
        return "noName";
      } else {
        return otherPlayerInfo.toString();
      }
    }
    
    const data = [
      {
        key: "1",
        name: 'Alex',
        address: <Address address={"0x59D101AD9DdeA84C0e11DA137000Dd91A0b20c79"} ensProvider={mainnetProvider} fontSize={16} />,
        role: "Host",
        buyinAmount: getBuyinAmount()
      },
    ];
   

  // TABLE VALUES ---------------------------------------------------------------------------------------------------

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (text) => <a>{text}</a>,
      width: '0px',
      align: 'center',
    },
    {
      title: 'Address',
      dataIndex: 'address',
      key: 'address',
      width: '0px',
      align: 'center',
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      width: '0px',
      align: 'center',
    },
    {
      title: 'Buyin amount',
      key: 'buyin-amount',
      dataIndex: 'buyinAmount',
      width: '0px',
      align: 'center',
    },
  ];

  //<Button onClick={printID}>Print Addresses</Button>

  
  return (
    <div><br /> 

      <h1>{getSpecPlayer()}</h1>

      <h1>{getSpecPlayer(0)}</h1> 


      <h1>{getName()}</h1>
      <h1>{otherPlayerInfo?.toString()}</h1>
  <h1>{getOtherPlayerName()}</h1>

      { getGameStatus() ?
      
      <div className = "startGame">
        <h1>Join a game</h1>
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
        
        <Button
          type="primary"
          style={{ marginTop: 8 }}
          onClick={async () => {
            if (gameName == "" || inputValue == "") {
                alert("Be sure to fill out all fields to join game.");
                return;
              } else {       
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
              }
          }}>Join Game</Button>   
          <br /> 
      </div>    
      
      
      :

      <div className="inGame">


      <div>

        
      {/*For Leaderboard -------------------------------------------------------------------------------------------*/}

      <div className="table"> 

        <Table columns={columns} dataSource={data} pagination={false} />
        

      </div>

        {/* -----------------------------------------------------------------------------------------------------------*/}


        <div>
          <br />
          { playerInfo[8] == true ?

          <div>                    
          <Button
            type="primary"
            style={{ marginTop: 8 }}
            onClick={async () => {     
           
            const result = tx(writeContracts.YourContract.terminateBuyin(playerInfo[1].toString()
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
          </div> : null }

          <Input
            style={{ width:"300px" }}
            placeholder="Final value of original buyin"
            type="text"
            value={withdrawalReq}
            name={req}
            onChange={(e) => setWithdrawalReq(e.target.value)}>
          </Input>

          <Button
            type="primary"
            style={{ marginTop: 8 }}
            onClick={async () => { 
              if (withdrawalReq == "") {
                alert("Enter your ending game total to proceed.");
                return;
              } else {      
              const result = tx(writeContracts.YourContract.addReq(playerInfo[1].toString(), utils.parseEther(`${withdrawalReq?.toString()}`)
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
            type="primary"
            style={{ marginTop: 8 }}
            onClick={async () => {     
              const result = tx(writeContracts.YourContract.verifyRequests(playerInfo[1].toString()), update => {
              console.log("📡 Transaction Update:", update);
            if (update && (update.status === "confirmed" || update.status === 1)) {
              console.log(" 🍾 Transaction " + update.hash + " finished!");
              console.log(" ⛽️ " + update.gasUsed + "/" + (update.gasLimit || update.gas) + " @ " + parseFloat(update.gasPrice) / 1000000000 + " gwei");
            } else {
              return;
            }});
            console.log("awaiting metamask/web3 confirm result...", result);
            console.log(await result);
            }}>Verify Requests</Button>   
        </div>  
        <div>
          <Button
            type="primary"
            style={{ marginTop: 8 }}
            onClick={async () => {     
              const result = tx(writeContracts.YourContract.payout(), update => {
              console.log("📡 Transaction Update:", update);
              if (update && (update.status === "confirmed" || update.status === 1)) {
                  console.log(" 🍾 Transaction " + update.hash + " finished!");
                  console.log(" ⛽️ " + update.gasUsed + "/" + (update.gasLimit || update.gas) + " @ " + parseFloat(update.gasPrice) / 1000000000 + " gwei");
              } else {
                return;
              }});
              console.log("awaiting metamask/web3 confirm result...", result);
              console.log(await result);
            }}>Payout</Button>
        </div>

            

        </div>
      </div>
      } 

      

   
    </div>
  );
}

export default Game;

{/* <Button onClick={printID}>Print Addresses</Button> */}
