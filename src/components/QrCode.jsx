import { useContractReader } from "eth-hooks";
import { ethers, utils } from "ethers";
import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { Button, Input, Select, Radio } from "antd";
import { useEffect } from "react";
import QRCode from 'qrcode';


export default function QrCode({
  writeContracts
}) {

  const senderInfo = useContractReader(writeContracts, "YourContract", "getPlayerInfo"); 

  function getGameId() {
    if (senderInfo == null || senderInfo[1] == null) {
      return 0;
    } else {
       return senderInfo[1];
    }
  }

  const [src, setSrc] = useState('');

  const text = "https://youtube.com";

  const [isShown, setIsShown] = useState(false);

    const handleClick = event => {
        // 👇️ toggle shown state
        setIsShown(current => !current);
    
        // 👇️ or simply set it to true
        // setIsShown(true);
    };

  useEffect(() => {
    QRCode.toDataURL(text).then((data) => {
      setSrc(data);
    });
  }, [src])

  return (
    <div>
        <Button type="primary" onClick={handleClick}>Share QR Code for Joining Game</Button>
        <br />
        {isShown && (
          <div className="App">
            <br />
            <img src={src} />
          </div>                    
        )}
        <br/>

        {isShown}                    
    </div>
  );
}
