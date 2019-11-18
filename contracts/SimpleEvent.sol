pragma solidity >=0.4.18;

contract SimpleEvent {
  uint256 public value;

  event NewValueSet(uint256 indexed _value);
  event AnotherEventSet(uint256 indexed _value);

  function set(uint256 _value) public {
    value = _value;
    emit NewValueSet(value);
    emit NewValueSet(value + 1);
    emit AnotherEventSet(value + 1);
  }
}