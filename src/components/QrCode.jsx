import { useContractReader } from "eth-hooks";
import { ethers, utils } from "ethers";
import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { Button, Input, Select, Radio } from "antd";
import { useEffect } from "react";
import QRCode from 'qrcode';


export default function QrCode({}) {

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
        <Button type="primary" onClick={handleClick}>Share QR Code</Button>
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
