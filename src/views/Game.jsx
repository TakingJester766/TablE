import { useContractReader } from "eth-hooks";
import { ethers, utils } from "ethers";
import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { Button, Input, Table, Card, Col, Row  } from "antd";
import { storeKeyNameFromField } from "@apollo/client/utilities";
import { Account, Address, Balance, Events } from "../components";
import { local } from "web3modal";
import { getByTestId } from "@testing-library/dom";
import { useEffect } from "react";


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

  function getPlayerIndex(index) {
    if (gameInfo == null) {
      return "Null!";
    } else {
      return gameInfo[10][index];
    }
  }

  function getPlayerNum() {
    if (gameInfo == null) {
      return 0;
    } else {
      return gameInfo[6];
    }
  }


  // Checks for msg.sender statuses -------------------------------------------------------------------------------------------------------------------
  
  const senderInfo = useContractReader(writeContracts, "YourContract", "getPlayerInfo"); // Indexing game 1, players 0

  function getHostStatus() {
    if (senderInfo == null || senderInfo[7] == false) {
      return "Not in game";
    } else if (senderInfo[8] == false) {
      return "Member";
    } else if (senderInfo[8] == true) {
      return "Host";
    }
  }

  function getPlayerId() {
    if (senderInfo == null || senderInfo[1] == null) {
      return 0;
    } else {
       return senderInfo[1];
    }
  }

  function getGameStatus() {
    if (senderInfo == null || senderInfo[7] == null || senderInfo[7] == false) {
      return true;
    } else {
      return false;
    }
  }


  

  //Host 

  //isInGame

  // Information for players --------------------------------------------------------------------------------------------------------------------------------

  /*string name; 0
    uint gameId; 1
    uint buyinAmount; 2
    uint withdrawalAmount; 3
    bool withdrawalReq; 4
    bool verifyReqs; 5
    bool hasWithdrawn; 6
    bool isInGame; 7
    bool isHost; 8*/

      // Get playerinfo -------------------------------------------------------------------------------------------------------------------------------

  const [gameIndex, setGameIndex] = useState("1");
  const [playerIndex, setPlayerIndex] = useState("0");

  let playerInfo = useContractReader(writeContracts, "YourContract", "getTest", [gameIndex, playerIndex]); // Indexing game 1, players 0

  function getName() {
    if (playerInfo == null) {
      return "test is undefined.";
    } else if (playerInfo[0] == null) { // test[0] is the name variable in the struct
      return "noName";
    } else {
      return playerInfo[0]?.toString();
    }
  }

  // GETTER FOR ADDRESS

  function getHostStatus() {
    if (playerInfo == null || playerInfo[7] == false) {
      return "Not in game";
    } else if (playerInfo[8] == false) {
      return "Member";
    } else if (playerInfo[8] == true) {
      return "Host";
    }
  }

  function getBuyinAmount() {
    if (playerInfo == null || playerInfo[2] == null) {
      return "0";
    } else {
      return utils.formatEther(playerInfo[2]?.toString());
    }
  }

  function getWithdrawalAmount() {
    if (playerInfo == null || playerInfo[3] == null || playerInfo[4] == 0) {
      return "0";
    } else {
      return utils.formatEther(playerInfo[3]?.toString());
    }
  }

  function getVerifStatus() {
    if (playerInfo == null || playerInfo[5] == null || playerInfo[5] == false) {
      return "False";
    } else {
      return "True";
    }
  }

  function hasReq() {
    if (playerInfo == null || playerInfo[4] == false) {
      return false;
    } else {
      return true;
    }
  }

// For adding players to the array


    
// Leaderboard Values -----------------------------------------------------------------------------------------------------------------------------------
    /*const numbers = [1, 2, 3, 4, 5];
    const doubled = numbers.map((number) => number * 2);
    console.log(doubled);*/

    const [playersLeaderboard, setPlayersLeaderboard] = useState();

    const [pot, setPot] = useState("0");
  /*
    useEffect(() => {
      const updatePot = async() => {
        try {
          
          const gameInfo = await writeContracts.YourContract.getGameInfo(senderInfo[1]);
        try {
          setPot(utils.parseEther(gameInfo[4]).toString());
          
        } catch(e) {
          setPot("0");
          console.log(e);
        } 

        } catch(e) {
          console.log(e);
        }
      }
      updatePot();
    }, [gameInfo, getPlayerNum()]);*/

    function getPot() {
      if (gameInfo == null || gameInfo[4] == null) {
        return "0";
      } else {
        return utils.formatEther(gameInfo[4]);
      }
    }

    useEffect(() => {
      const updateGameIndex = async() => {
        try {
          setGameIndex(getPlayerId().toString());
        } catch(e) {
          console.log(e);
        }
      }
    }, [getPlayerId()])


    useEffect(() => {
      const updateDashboard = async() => {
        const data = [];
        for (let i = 0; i < getPlayerNum(); i++) {
          try {
            setPlayerIndex(i);
            console.log("Getting player array: " + i);
            const playerInformation = await writeContracts.YourContract.getTest(gameIndex, i)
          
            try {
              data.push(
                {
                  key: (i + 1).toString(),
                  name: playerInformation[0],
                  address: <Address address={getPlayerIndex(i)?.toString()} ensProvider={mainnetProvider} fontSize={16} />,
                  role: playerInformation[8] ? "Host" : "Guest",
                  buyinAmount: utils.formatEther(playerInformation[2]),
                  endingTotal: utils.formatEther(playerInformation[3]),
                  hasVerified: playerInformation[5] ? "True" : "False"
                }
              )
            } catch(e) {
              console.log(e);
            }
          } catch(e) {
            console.log(e);
          }
        }
        setPlayersLeaderboard(data);
      };
      updateDashboard();
    }, [gameInfo, getPlayerNum()]);

  // TABLE VALUES ---------------------------------------------------------------------------------------------------------------------------------

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
      title: 'Starting Amount',
      key: 'buyin-amount',
      dataIndex: 'buyinAmount',
      width: '0px',
      align: 'center',
    },
    {
      title: 'Ending Total',
      key: 'ending-total',
      dataIndex: 'endingTotal',
      width: '0px',
      align: 'center'
    },
    {
      title: 'Has Verified Payout',
      key: 'has-verified',
      dataIndex: 'hasVerified',
      width: '0px',
      align: 'center'
    }
  ];

  //  Card for housing buttons ----------------------------------------------------------------------------------------------------------------------------------

  



//      <Button onClick={print()}>Print</Button>

  function print() {
    if (test == null) {
      console.log("getTest is undefined!")
    } else {
      console.log(test?.toString());
    }
  }

  
  return (
    <div><br />

      <h1>Game Dashboard</h1>

      { getGameStatus() == true ?
      
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
        <div>
          <h2>Total Deposits for Game: {getPot()} ether</h2>
        </div>
        
      {/*For Leaderboard -------------------------------------------------------------------------------------------*/}

      <div className="table">
        

        <Table columns={columns} dataSource={playersLeaderboard} pagination={false} />
        

      </div>

        {/* -----------------------------------------------------------------------------------------------------------*/}


        <div>
          <br />
          { getHostStatus() ?

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

          <br />

          <Input
            style={{ width:"150px" }}
            placeholder="Your Ending Total"
            type="text"
            value={withdrawalReq}
            name={req}
            onChange={(e) => setWithdrawalReq(e.target.value)}>
          </Input>


          <Button
            type="primary"
            className="requestButton"
            style={{ marginTop: 8 }}
            onClick={async () => { 
              if (withdrawalReq == "") {
                alert("Enter your ending game total to proceed.");
                return;
              } else {
                if (gameInfo[8] == false) {
                  alert('Make sure that your host has ended the buyin period.')
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
          }}}}>Add a Request</Button>  

          <Button
            type="primary"
            style={{ marginTop: 8 }}
            onClick={async () => { 
              if (playerInfo[4] == false) {
                alert("You must submit a request in order to revoke it.");
              } else {
                if (gameInfo[8] == false) {
                  alert('Make sure that your host has ended the buyin period.')
                } else {    
                  const result = tx(writeContracts.YourContract.abortReq(playerInfo[1].toString()
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
          }}}}>Revert a Request</Button>      

        </div>

        <br />   

        <div>

          <Button
            type="primary"
            style={{ marginTop: 8 }}
            onClick={async () => {
              if (playerInfo[4] == false) {
                alert('You must submit your ending total before verifying other players\' amounts.')
              } else if (gameInfo[8] == false) { 
                alert('Make sure that your host has ended the buyin period.');
              } else {
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
            }}}>Verify Requests</Button>   
          
        
          <Button
            className="payoutButton"
            type="primary"
            style={{ marginTop: 8 }}
            onClick={async () => {
              if (gameInfo[8] == false) {
                alert('You still have several steps before payout, including the host ending the buyin period, submitting ending totals, and verifying totals.');
              } else if (playerInfo[4] == false) {
                alert('You still need to submit your ending total and verify all player withdrawal requests.')
              } else if (playerInfo[5] == false) {
                alert('You still need to verify player requests.')
              } else {      
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
            }}}>Payout</Button>
        </div>

            

        </div>
      </div>
      } 

      

   
    </div>
  );
}

export default Game;

{/* <Button onClick={printID}>Print Addresses</Button> */}
