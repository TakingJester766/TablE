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

    const purpose = useContractReader(readContracts, "YourContract", "initFee");
    const [newInitFee, changeInitFee] = useState("loading...");

    const initFee = useContractReader(readContracts, "YourContract", "initFee");
    
    const feesPending = useContractReader(readContracts, "YourContract", "feesPending");

    return (
        <div>
            <div>
                <h1>What are you doing here, ANON? (⌐■_■)</h1>
                
                <h1>Current Fee: {utils.formatEther(`${initFee?.toString()}`)}</h1>


                <Input style={{ width:"300px" }}
                onChange={e => {
                    changeInitFee(e.target.value);
                }}
                /><br/>
                <Button
                    style={{ marginTop: 8 }}
                    onClick={async () => {
                    /* look how you call setPurpose on your contract: */
                    /* notice how you pass a call back for tx updates too */
                    const result = tx(writeContracts.YourContract.changeInitFee(utils.parseEther(`${newInitFee.toString()}`)), update => {
                        console.log("📡 Transaction Update:", update);
                        if (update && (update.status === "confirmed" || update.status === 1)) {
                        console.log(" 🍾 Transaction " + update.hash + " finished!");
                        console.log(
                            " ⛽️ " +
                            update.gasUsed +
                            "/" +
                            (update.gasLimit || update.gas) +
                            " @ " +
                            parseFloat(update.gasPrice) / 1000000000 +
                            " gwei",
                        );
                        }
                    });
                    console.log("awaiting metamask/web3 confirm result...", result);
                    console.log(await result);
                    }}>
                    Set New Game Initialization Fee
                </Button>
            </div>        

            <div>

            <h1>Fees pending: {utils.formatEther(`${feesPending?.toString()}`)}</h1>
               
            <Button
            style={{ marginTop: 8 }}
            onClick={async () => {
              /* look how you call setPurpose on your contract: */
              /* notice how you pass a call back for tx updates too */
              const result = tx(writeContracts.YourContract.withdrawFees(), update => {
                console.log("📡 Transaction Update:", update);
                if (update && (update.status === "confirmed" || update.status === 1)) {
                  console.log(" 🍾 Transaction " + update.hash + " finished!");
                  console.log(
                    " ⛽️ " +
                      update.gasUsed +
                      "/" +
                      (update.gasLimit || update.gas) +
                      " @ " +
                      parseFloat(update.gasPrice) / 1000000000 +
                      " gwei",
                  );
                }
              });
              console.log("awaiting metamask/web3 confirm result...", result);
              console.log(await result);
            }}
          >
            Withdraw Fees
          </Button>           
        



            </div>








        </div>
    )
}

export default OwnerControls;

/*<button onClick={print}>Print</button>      
function print() {
    console.log(inputValue);
}
*/