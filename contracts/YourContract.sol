pragma solidity >=0.8.0 <0.9.0;
//SPDX-License-Identifier: MIT

import "hardhat/console.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

// import "@openzeppelin/contracts/access/Ownable.sol"; 
// https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/access/Ownable.sol

contract YourContract is Ownable, ReentrancyGuard {

    // Constructor statement

    constructor() ReentrancyGuard() {}

    uint public num = 1;

    mapping(address => uint) public addressToNum;

    function setMapping() public {
        addressToNum[msg.sender] = num;
        num++;
    }

    function getMapping(address addr) public view returns (uint) {
        return addressToNum[addr];
    }

    
    // Declaration of gameNumber: -----------------------------------------------------------------------------------
    //uint public tempNum = 1;
    uint public gameNumber = 1;
    uint public initFee = 1000000000000000;
    uint public feesPending = 0;


    event IncGameNumber(uint gameNumber);

    function incGameNumber() internal {
        gameNumber++;
        emit IncGameNumber(gameNumber);
    }


    // Structs 
    struct Game {
        address host; // Establishes host function access 0
        uint gameId; // Allows different games to be played concurrently 1
        uint buyinRequirement; // To establish minimum buyin amount for a game 2
        uint etherWithdrawalReqs; // Tracks # of ether in total from requests. If >/< than contract balance, throws error 3   
        uint gamePot; // Tracks how much ether is in the game's pot 4 
        uint8 tableWithdrawalReqs; // Tracks how many players have requested a withdrawal 5
        uint8 playerCount; // Tracks # of of players in a game 6
        uint8 verifiedWithdrawalReqs; // Tracks # of verifs that withdrawal requests are valid 7
        bool endedBuyin; // Host function to end buyin stage 8
        bool isActive; // Checks if game struct is already done 9 
        address[] playerList; // 10
    }
    
    struct Player {
        string name; // Allows players to more easily identify eachother
        uint gameId; // gameId generated from gameNumber
        uint buyinAmount; // How much a player has bought in with
        uint withdrawalAmount; // How much a player has requested a withdrawal for
        bool withdrawalReq; // Tracks if a player has submitted a request
        bool verifyReqs; // TO verify that all withdrawal requests look good at table
        bool hasWithdrawn; // To signify that a player has paidout to prevent triggering of any functions after they receieve back their funds
        bool isInGame; // Is in game bool
        bool isHost; // Is host
    }

    // Mapping for players
    mapping(address => Player) public playerInfo; // To call Player struct based on the msg.sender

    // Mapping for locating each game's details
    mapping(uint => Game) public idToGame; // To call Game struct to see game details

    // Test mapping
    mapping(address => uint) public testMapping;
    
    function setTestMapping() public {
        testMapping[msg.sender] = 1;
    }

    function getTestMapping() public view returns (uint) {
        return testMapping[msg.sender];
    }
    // Array for Game structs. Allows games to be played continuously by resetting value in accordance with the current array struct
    Game[] public games;

    // Modifiers ---------------------------------------------------------------------------------------------------

    // To check if in game + if game is active:

    modifier isNotInGame() { // To verify that msg.sender is not in a game
        require(playerInfo[msg.sender].isInGame == false, "You must finish your current game before joining or hosting a new one");
        _;
    }

    modifier isActiveGame() {
        require(idToGame[playerInfo[msg.sender].gameId].isActive == true, "Make sure the game you are trying to interact with has not ended.");        
        _;
    }

    modifier checkCalls() { // To verify that msg.sender is attemping to join a game that has not ended
        require(playerInfo[msg.sender].isInGame == true, "You must finish your current game before joining or hosting a new one.");
        require (playerInfo[msg.sender].gameId == idToGame[playerInfo[msg.sender].gameId].gameId, "You are attempting to call functions to a game that is not your own!");
        require(playerInfo[msg.sender].hasWithdrawn == false, "You have already withdrawn from this game!");       
        require(idToGame[playerInfo[msg.sender].gameId].isActive == true, "Make sure the game you are tring to interact with has not ended.");
        require(idToGame[playerInfo[msg.sender].gameId].endedBuyin == true, "Make sure your host has ended buyin before proceeding.");
        _;
    }

    modifier verifyChecks() { // To verify that msg.sender is in a game
        require(idToGame[playerInfo[msg.sender].gameId].tableWithdrawalReqs == idToGame[playerInfo[msg.sender].gameId].playerCount, "Verify that everyone has submitted a withdrawal request before proceeding.");        
        require(idToGame[playerInfo[msg.sender].gameId].gamePot == idToGame[playerInfo[msg.sender].gameId].etherWithdrawalReqs, "Double check withdrawal amounts, it appears that not the entire game pot has been claimed.");
        _;
    }

    // ------------------------------------ Functions to enable new games --------------------------------------

    function addFeesPending() internal {
        feesPending += initFee;
    }


    function startGame(string memory name, uint buyinReq) public payable isNotInGame {     
        require(initFee == .001 ether, "In order to prevent spam games that never resolve, each game initialization will cost  ether.");
        require(playerInfo[msg.sender].isHost == false, "You are already hosting a game!");
        addFeesPending();
        playerInfo[msg.sender] = Player(name, gameNumber, 0, 0, false, false, false, false, true);
        address[] memory add;
        idToGame[gameNumber] = Game(msg.sender, gameNumber, buyinReq, 0, 0, 0, 0, 0, false, true, add);
        games.push(idToGame[gameNumber]);
        incGameNumber();
    }    

    // ------------------------------------------ Buyin Functions ----------------------------------------------

     function buyin(string memory name, uint inputId, uint buyinAmount) public payable isNotInGame {
        require(idToGame[inputId].isActive == true, "Make sure the game you are tring to interact with has not ended.");        
        require (buyinAmount >= idToGame[inputId].buyinRequirement, "Check the minumum buyin requirement, it appears it is higher than your deposit!");
        //require (inputId == playerInfo[msg.sender].gameId, "You are attempting to call functions to a game that is not your own!");
        buyinAmount = msg.value;
        // Check if hosting:
        if (playerInfo[msg.sender].isHost) {
            playerInfo[msg.sender].buyinAmount = buyinAmount;
            playerInfo[msg.sender].isInGame = true;
        } else {
        playerInfo[msg.sender] = Player(name, inputId, msg.value, 0, false, false, false, true, false);
        }
        idToGame[inputId].playerCount++;
        idToGame[inputId].gamePot += msg.value;
        idToGame[inputId].playerList.push(msg.sender);
        payable(this).transfer(buyinAmount);
    }

    // For host to prevent further buyins

    function terminateBuyin (uint inputId) public isActiveGame {
        require(playerInfo[msg.sender].isInGame == true, "Verify you are interacting with the correct game.");
        require (playerInfo[msg.sender].gameId == idToGame[playerInfo[msg.sender].gameId].gameId, "You are attempting to call functions to a game that is not your own!");
        require(playerInfo[msg.sender].isHost == true, "Only hosts of their games can end the buyin stage.");
        require (idToGame[inputId].playerCount > 0, "You cannot end the buy-in period with 0 players!");
        require (idToGame[inputId].endedBuyin == false, "You have already ended the buyin period.");            
        idToGame[inputId].endedBuyin = true;
    }
    // ------------------------------------------ Withdrawal Functions ----------------------------------------------

     function addReq(uint inputId, uint amount) public checkCalls {
        require(playerInfo[msg.sender].withdrawalReq == false, "You have already submitted a withdrawal request. Please abort current withdrawal request to make a new one.");
        playerInfo[msg.sender].withdrawalReq = true;
        playerInfo[msg.sender].withdrawalAmount = amount;
        idToGame[inputId].etherWithdrawalReqs += amount;
        idToGame[inputId].tableWithdrawalReqs++;
    }

    function abortReq(uint inputId) public checkCalls {        
        require(playerInfo[msg.sender].withdrawalReq == true, "You must have a pending withdrawal request in order to abort and submit a new one.");
        playerInfo[msg.sender].withdrawalReq = false; // Changes player's withdrawal request status to false
        idToGame[inputId].tableWithdrawalReqs--; // Subtracts the player withdrawal request from the game struct
        idToGame[inputId].etherWithdrawalReqs -= playerInfo[msg.sender].withdrawalAmount;
        playerInfo[msg.sender].withdrawalAmount = 0;
    }

     function verifyRequests(uint inputId) public nonReentrant checkCalls verifyChecks {
        require(playerInfo[msg.sender].withdrawalReq == true, "You must submit a withdrawal request from the game before verifying the tables' requests.");
        require(playerInfo[msg.sender].verifyReqs == false, "You have already verified all withdrawal requests!");        
        playerInfo[msg.sender].verifyReqs = true;
        idToGame[inputId].verifiedWithdrawalReqs++;
    }

    function payout() nonReentrant() external checkCalls verifyChecks {
        require(playerInfo[msg.sender].withdrawalReq == true, "You must submit a withdrawal request from the game before verifying the tables' requests.");
        require(idToGame[playerInfo[msg.sender].gameId].tableWithdrawalReqs == idToGame[playerInfo[msg.sender].gameId].verifiedWithdrawalReqs, "Verify that everyone has submitted a withdrawal request before proceeding.");   
        uint toBeSent = playerInfo[msg.sender].withdrawalAmount;
        playerInfo[msg.sender].withdrawalAmount = 0;
        playerInfo[msg.sender].buyinAmount = 0;
        playerInfo[msg.sender].withdrawalReq = false;
        playerInfo[msg.sender].verifyReqs = false;
        playerInfo[msg.sender].gameId = 0;
        playerInfo[msg.sender].hasWithdrawn = true;
        playerInfo[msg.sender].isInGame = false;
        playerInfo[msg.sender].isHost = false;
        idToGame[playerInfo[msg.sender].gameId].isActive = false;
        payable(msg.sender).transfer(toBeSent);

    }  

    // ------------------------------------------ Contract Owner Functions ----------------------------------------------------------------------

    function changeInitFee(uint newInitFee) public onlyOwner {
        initFee = newInitFee;
    }

    function withdrawFees() public onlyOwner {
        require(feesPending > 0, "No fees to collect.");
        feesPending = 0;
        payable(msg.sender).transfer(feesPending);
    }

     // ------------------------------------------ Getter for playerList array -------------------------------------------------------------------

    function getOtherPlayerInfo(address addr) public view returns (Player memory) {
        return playerInfo[addr];
    }

    function getPlayerInfo() public view returns (Player memory) {
        return playerInfo[msg.sender];
    }

    function getGameInfo(uint id) public view returns (Game memory) {
        return idToGame[id];
    }
    
  
  // to support receiving ETH by default
  receive() external payable {}
  fallback() external payable {}
}



