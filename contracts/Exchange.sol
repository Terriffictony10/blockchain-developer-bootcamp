// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "./Token.sol";

contract Exchange {
    address public feeAccount; // Account that receives trading fees
    uint256 public feePercent; // Percentage of the trade amount taken as fee
    mapping(address => mapping(address => uint256)) public tokens; // Token balances mapped by token addresses and user addresses
    mapping(uint256 => _Order) public orders; // Mapping of order IDs to Order structs
    uint256 public orderCount; // Counter for the total number of orders
    mapping(uint256 => bool) public orderCancelled; // Mapping to track if an order is cancelled
    mapping(uint256 => bool) public orderFilled; // Mapping to track if an order is filled

    // Events to emit on various actions
    event Deposit(
        address token,
        address user,
        uint256 amount,
        uint256 balance
    );
    event Withdraw(
        address token,
        address user,
        uint256 amount,
        uint256 balance
    );
    event Order(
        uint256 id,
        address user,
        address tokenGet,
        uint256 amountGet,
        address tokenGive,
        uint256 amountGive,
        uint256 timestamp
    );
    event Cancel(
        uint256 id,
        address user,
        address tokenGet,
        uint256 amountGet,
        address tokenGive,
        uint256 amountGive,
        uint256 timestamp
    );
    event Trade(
        uint256 id,
        address user,
        address tokenGet,
        uint256 amountGet,
        address tokenGive,
        uint256 amountGive,
        address creator,
        uint256 timestamp
    );

    // Structure of an order
    struct _Order {
        uint256 id; // Unique identifier for the order
        address user; // User who created the order
        address tokenGet; // Address of the token to receive
        uint256 amountGet; // Amount of token to receive
        address tokenGive; // Address of the token to give
        uint256 amountGive; // Amount of token to give
        uint256 timestamp; // Timestamp when the order was created
    }

    // Constructor to initialize the fee account and fee percentage
    constructor(address _feeAccount, uint256 _feePercent) {
        feeAccount = _feeAccount;
        feePercent = _feePercent;
    }

    // ------------------------
    // DEPOSIT & WITHDRAW TOKEN

    // Function to deposit tokens into the exchange
    function depositToken(address _token, uint256 _amount) public {
        // Transfer tokens from the user to the exchange
        require(Token(_token).transferFrom(msg.sender, address(this), _amount));

        // Update user's token balance
        tokens[_token][msg.sender] = tokens[_token][msg.sender] + _amount;

        // Emit a deposit event
        emit Deposit(_token, msg.sender, _amount, tokens[_token][msg.sender]);
    }

    // Function to withdraw tokens from the exchange
    function withdrawToken(address _token, uint256 _amount) public {
        // Ensure the user has enough tokens to withdraw
        require(tokens[_token][msg.sender] >= _amount);

        // Transfer tokens from the exchange to the user
        Token(_token).transfer(msg.sender, _amount);

        // Update user's token balance
        tokens[_token][msg.sender] = tokens[_token][msg.sender] - _amount;

        // Emit a withdraw event
        emit Withdraw(_token, msg.sender, _amount, tokens[_token][msg.sender]);
    }

    // Function to check the token balance of a user
    function balanceOf(address _token, address _user)
        public
        view
        returns (uint256)
    {
        return tokens[_token][_user];
    }

    // ------------------------
    // MAKE & CANCEL ORDERS

    // Function to create a new order
    function makeOrder(
        address _tokenGet,
        uint256 _amountGet,
        address _tokenGive,
        uint256 _amountGive
    ) public {
        // Ensure the user has enough tokens to create the order
        require(balanceOf(_tokenGive, msg.sender) >= _amountGive);

        // Increment the order count and create a new order
        orderCount ++;
        orders[orderCount] = _Order(
            orderCount,
            msg.sender,
            _tokenGet,
            _amountGet,
            _tokenGive,
            _amountGive,
            block.timestamp
        );

        // Emit an order event
        emit Order(
            orderCount,
            msg.sender,
            _tokenGet,
            _amountGet,
            _tokenGive,
            _amountGive,
            block.timestamp
        );
    }

    // Function to cancel an existing order
    function cancelOrder(uint256 _id) public {
        // Fetch the order to be cancelled
        _Order storage _order = orders[_id];

        // Ensure the caller is the creator of the order
        require(address(_order.user) == msg.sender);

        // Ensure the order exists
        require(_order.id == _id);

        // Mark the order as cancelled
        orderCancelled[_id] = true;

        // Emit a cancel event
        emit Cancel(
            _order.id,
            msg.sender,
            _order.tokenGet,
            _order.amountGet,
            _order.tokenGive,
            _order.amountGive,
            block.timestamp
        );
    }

    // ------------------------
    // EXECUTING ORDERS

    // Function to fill an existing order
    function fillOrder(uint256 _id) public {
        // Ensure the order ID is valid
        require(_id > 0 && _id <= orderCount, "Order does not exist");
        // Ensure the order is not already filled
        require(!orderFilled[_id]);
        // Ensure the order is not cancelled
        require(!orderCancelled[_id]);

        // Fetch the order to be filled
        _Order storage _order = orders[_id];

        // Execute the trade
        _trade(
            _order.id,
            _order.user,
            _order.tokenGet,
            _order.amountGet,
            _order.tokenGive,
            _order.amountGive
        );

        // Mark the order as filled
        orderFilled[_order.id] = true;
    }

    // Internal function to execute a trade
    function _trade(
        uint256 _orderId,
        address _user,
        address _tokenGet,
        uint256 _amountGet,
        address _tokenGive,
        uint256 _amountGive
    ) internal {
        // Calculate the fee to be paid
        uint256 _feeAmount = (_amountGet * feePercent) / 100;

        // Execute the trade: update balances
        // Deduct tokens from the user who filled the order
        tokens[_tokenGet][msg.sender] =
            tokens[_tokenGet][msg.sender] -
            (_amountGet + _feeAmount);

        // Add tokens to the order creator
        tokens[_tokenGet][_user] = tokens[_tokenGet][_user] + _amountGet;

        // Transfer the fee to the fee account
        tokens[_tokenGet][feeAccount] =
            tokens[_tokenGet][feeAccount] +
            _feeAmount;

        // Deduct tokens from the order creator
        tokens[_tokenGive][_user] = tokens[_tokenGive][_user] - _amountGive;

        // Add tokens to the user who filled the order
        tokens[_tokenGive][msg.sender] =
            tokens[_tokenGive][msg.sender] +
            _amountGive;

        // Emit a trade event
        emit Trade(
            _orderId,
            msg.sender,
            _tokenGet,
            _amountGet,
            _tokenGive,
            _amountGive,
            _user,
            block.timestamp
        );
    }
}
