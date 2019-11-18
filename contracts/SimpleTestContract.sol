pragma solidity >=0.4.18;

contract SimpleTestContract {
  uint value;
  uint[] myArray;

  event NewValueSet(uint _value);

  function set(uint _value) public {
    value = _value;
    emit NewValueSet(value);
  }

  function loop() public {
    for (uint i=1; i>0;) {
      myArray.push(7777777777777777); 
    }
  }

  function get() public view returns (uint) {
    return value;
  }

  function err(uint _value) public {
    value = _value;
    emit NewValueSet(value);
    revert("Revert");
  }
}
