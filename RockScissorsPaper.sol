// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

contract RockScissorsPaper {
    // правила игры
    string public constant gameRules = "Make deposit 0.0001 tBNB or more. Choose only 0 (rock), 1 (scissors), 2 (paper). You can win x2 of you deposit. Game Result: 0 - you win, 1 - you lose, 2 - draw. ";

    //варианты значений результата
    enum Status { Win, Lose, Draw }

    //можно пополнить баланс при создании контракта
    constructor() payable {

    }

    // позволяет отправлять деньги на контракт
    receive() external payable {

    }

    //событие для записи результатов игры
    event GamePlayer(address player, Status currentStatus);
  
    //модификатор проверяет возможность начала игры
    modifier payCoin(uint8 _option) {
        require (_option <= 2, "You can choose only 0 (rock), 1 (scissors), 2 (paper)");
        require (address(this).balance >= msg.value *2, "Smart-contract run ot of funds");
        require (msg.value >= 100000000000000, "Make deposit >= 0.0001 tBNB");
        _;
    }

    // функция игры
    function playGame(uint8 _option) public payable payCoin(_option) returns(Status) {
        Status _currentStatus;
        uint256 output = block.timestamp%3;

            if ((_option == 0 && output == 1) || (_option == 1 && output == 2) || (_option == 2 && output == 0)) {
                payable(msg.sender).transfer(msg.value * 2);
                _currentStatus = Status.Win;             
            } else if (_option == output) {
                payable(msg.sender).transfer(msg.value);
                _currentStatus = Status.Draw;
            } else {
            _currentStatus = Status.Lose;
            }

        emit GamePlayer(msg.sender, _currentStatus);
        return _currentStatus;
    }

}