import React from "react";
import { Typography } from "antd";
import diamond from '../themes/images/diamond.png';


const { Title, Text } = Typography;

// displays a page header

export default function Header({ link, title, subTitle, ...props }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", padding: "1.2rem" }}>
      <div style={{ display: "flex",  flexDirection: "column", flex: 1, alignItems: "start" }}>
        <img className="diamondHeader" src={diamond} alt="card" />
        <a href={link} target="_blank" rel="noopener noreferrer">
          <h1 level={4} style={{ margin: "0 0.5rem 0 0" }}>{title}</h1>
        </a>
        <Text type="secondary" style={{ textAlign: "left" }}>{subTitle}</Text>
      </div>
      {props.children}
    </div>
  );
}

Header.defaultProps = {
  link: "https://github.com/austintgriffith/scaffold-eth",
  title: "TablΞ",
  subTitle: "The decentralized way to take your friends' money.",
};