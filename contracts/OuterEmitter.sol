pragma solidity >=0.4.18;

import './InnerEmitter.sol';

contract OuterEmitter {
    InnerEmitter innerEmitter;

    function setInner(address innerAddr) public {
        innerEmitter = InnerEmitter(innerAddr);
    }

    function sendEvent(uint i) public {
        innerEmitter.sendEvent(i);
    }
    function err(uint _value) public {
        revert("Revert");
    }
}