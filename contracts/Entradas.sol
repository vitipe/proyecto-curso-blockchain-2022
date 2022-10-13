// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

uint256 constant ENTRADAS_TOTALES = 10;
uint256 constant PRECIO_ENTRADA = 0.1 ether;


contract Entradas {
  address public owner = msg.sender;

  struct Entrada {
    uint256 price;
    address owner;
  }

  Entrada[ENTRADAS_TOTALES] public entradas;

  constructor() {
    for(uint256 i= 0; i < ENTRADAS_TOTALES; i++) {
      entradas[i].price = PRECIO_ENTRADA; 
      entradas[i].owner = address(0x0);
    }
  }

  function comprarEntrada(uint256 _index) external payable {
    require(_index < ENTRADAS_TOTALES && _index >= 0);
    require(entradas[_index].owner == address(0x0));
    require(msg.value >= entradas[_index].price);
    entradas[_index].owner = msg.sender;
  }

}