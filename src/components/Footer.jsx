import React from "react";
import { Typography } from "antd";
import twitter from '../themes/images/twitter.png';
import twitter from '../themes/images/github.png';





const { Title, Text } = Typography;

// displays a page header

export default function Footer({ link, title, subTitle, ...props }) {
  return (
    <div>
        <footer id="footer">
        <a href="https://twitter.com/ZimAlternate" target="_blank">
            <img className="twitter" src={twitter} alt="twitter-bird"/>
        </a>
        <a>
            <img className="github" src={github} alt="github-cat"/>
        </a>

            
        </footer>
    </div>
  );
}
