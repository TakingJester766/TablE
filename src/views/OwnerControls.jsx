import { useContractReader, useUserProviderAndSigner } from "eth-hooks";
import { ethers, utils, formatUnits } from "ethers";
import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { Button, Input, Select, Radio, Table } from "antd";
import { useEffect } from "react";
import { Account, Address, Balance, Events } from "../components";
import QRCode from 'qrcode';


/**
 * web3 props can be passed from '../App.jsx' into your local view component for use
 * @param {*} yourLocalBalance balance on current network
 * @param {*} readContracts contracts from current chain already pre-loaded using ethers contract module. More here https://docs.ethers.io/v5/api/contract/contract/
 * @returns react component
 **/
function OwnerControls({
    address,
    mainnetProvider,
    localProvider,
    yourLocalBalance,
    price,
    tx,
    readContracts,
    writeContracts,
}) {

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

    /*

    function getBuyinRequirement() {
      if (infoSplit == null) {
        return 0;
      } else {
        return utils.formatUnits(infoSplit[2].toString());
      }
    }

    function getHost() {
      if (infoSplit == null) {
        return 0;
      } else {
        let rawAddr = (infoSplit[0]);
        let formattedAddr = <Address address={rawAddr} ensProvider={mainnetProvider} fontSize={16}/>;
        return formattedAddr;
      }
    }

    function getGamePot() {
      if (infoSplit == null) {
        return 0;
      } else {
        return utils.formatUnits(infoSplit[4].toString());
      }
    }

    // Functions for getting player data

    
    string name; 0
        uint gameId; 1
        uint buyinAmount; 2
        uint withdrawalAmount; 3
        bool withdrawalReq; 4
        bool verifyReqs; 5
        bool hasWithdrawn; 6
        bool isInGame; 7
        bool isHost; 8
    

    function getBuyinAmount() {
      if (playerInfoSplit == null) {
        return 0;
      } else {
        return utils.formatUnits(playerInfoSplit[2].toString());
      }
    } 
    
    function getGameId() {
      if (playerInfoSplit == null) {
        return 0;
      } else {
        return utils.formatUnits(playerInfoSplit[1].toString());
      }
    }       

    function getIsHost() {
      if (playerInfoSplit == null) {
        return false;
      } else {
        if (playerInfoSplit[8] == false) {
          return "false";
        } else {
          return "true";
        }
      }
    }

    function print() {
      console.log(address.toString());
    }*/

    const gameInfo = useContractReader(readContracts, "YourContract", "getGameInfo", "1");

    //const playerInfo = useContractReader(readContracts, "YourContract", "getPlayerInfo");

    // ---------------------------------------------------------------------------------------------------------------


    const [addr, setAddress] = useState("");
    const userMapping = useContractReader(writeContracts, "YourContract", "getMapping", [addr]);


    function getAddressNumber() {
      if (userMapping == null) {
        return "Set the mapping and put in an address!"
      } else {
        return userMapping;
      }
    }

    function print() {
      console.log(userMapping);
    }

    return (

        <div>

          <Button
            type="primary"
            style={{ marginTop: 8 }}
            onClick={async () => {   
              const result = tx(writeContracts.YourContract.setMapping(), update => {
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
          }>Set the mapping!</Button>
          <br />

          <Input
            style={{ width:"300px" }}
            placeholder="Address to check:"
            type="text"
            value={addr}
            onChange={(e) => setAddress(e.target.value)}>
          </Input>
          

        </div>
    )
}

export default OwnerControls;

{/* <Button onClick={print}>Print num</Button> */}


          