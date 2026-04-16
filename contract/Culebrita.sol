// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.8.2 <0.9.0;

/**
 * @title Culebrita
 * @dev Game contract to store player nicknames and top scores
 * @custom:dev-run-script ./scripts/deploy_with_ethers.ts
 */
contract Culebrita {

    struct Player {
        string nickname;
        uint256 topScore;
    }

    mapping(address => Player) public players;
    mapping(address => bool) public isRegistered;

    event PlayerRegistered(address indexed playerAddress, string nickname);
    event ScoreUpdated(address indexed playerAddress, uint256 newScore);

    /**
     * @dev Register a new player
     * @param _nickname Player's nickname
     */
    function registerPlayer(string memory _nickname) public {
        require(!isRegistered[msg.sender], "Player already registered");
        require(bytes(_nickname).length > 0, "Nickname cannot be empty");

        players[msg.sender] = Player(_nickname, 0);
        isRegistered[msg.sender] = true;

        emit PlayerRegistered(msg.sender, _nickname);
    }

    /**
     * @dev Update player's top score (only if new score is higher)
     * @param _newScore New score to record
     */
    function updateScore(uint256 _newScore) public {
        require(isRegistered[msg.sender], "Player not registered");
        require(_newScore > players[msg.sender].topScore, "New score must be higher than current top score");

        players[msg.sender].topScore = _newScore;

        emit ScoreUpdated(msg.sender, _newScore);
    }

    /**
     * @dev Get player information
     * @param _playerAddress Player's wallet address
     * @return nickname Player's nickname
     * @return topScore Player's top score
     */
    function getPlayer(address _playerAddress) public view returns (string memory nickname, uint256 topScore) {
        require(isRegistered[_playerAddress], "Player not found");

        Player memory player = players[_playerAddress];
        return (player.nickname, player.topScore);
    }

    /**
     * @dev Check if player is registered
     * @param _playerAddress Player's wallet address
     * @return true if player exists, false otherwise
     */
    function playerExists(address _playerAddress) public view returns (bool) {
        return isRegistered[_playerAddress];
    }
}
