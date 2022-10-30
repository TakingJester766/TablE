import { useContractReader, useUserProviderAndSigner } from "eth-hooks";
import { ethers, utils, formatUnits } from "ethers";
import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { Button, Input, Select, Radio } from "antd";
import { useEffect } from "react";
import { Account, Address, Balance, Events } from "../components";
import QRCode from 'qrcode';


/**
 * web3 props can be passed from '../App.jsx' into your local view component for use
 * @param {*} yourLocalBalance balance on current network
 * @param {*} readContracts contracts from current chain already pre-loaded using ethers contract module. More here https://docs.ethers.io/v5/api/contract/contract/
 * @returns react component
 **/
function TestComponent(props) {

    

    return (




        <div>

          

          <Button onClick={() => props.changeWord('word changed')}>Change Word</Button>


        </div>
    )
}

export default TestComponent;


          