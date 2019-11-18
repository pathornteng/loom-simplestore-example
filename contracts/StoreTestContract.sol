pragma solidity >=0.5.0;

contract StoreTestContract {
	mapping(uint => User) users;
	address payable _owner;
	struct User{
		uint id;
		uint balance;
		string username;
	}

    function owner() public view returns (address) {
        return _owner;
    }

	function addUser(uint id, uint balance, string memory username) public {
		users[id] = User(id, balance, username);   
	}

	function getUser(uint id) public view returns (uint, uint, string memory) {
		User memory u = users[id];
		return (u.id, u.balance, u.username);
	}

	function close() public {
		selfdestruct(_owner);
	}

}