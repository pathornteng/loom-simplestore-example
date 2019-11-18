pragma solidity >=0.4.18;

contract LoadtestContract {
  uint value;
  uint[] myArray;

  event NewValueSet(uint _value);

  function infiniteLoop() public {
    for (uint i=1; i>0;) {}
  }

  function storageConsumption(uint _time) public {
    for (uint i=1; i<_time; i++) {
      myArray.push(7777777777777777);
    }
  }
}
