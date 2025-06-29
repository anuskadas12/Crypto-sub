// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract SubscriptionManager is ERC721URIStorage, Ownable, ReentrancyGuard {
    using Counters for Counters.Counter;
    
    Counters.Counter private _tokenIds;
    
    struct SubscriptionPlan {
        uint256 id;
        string name;
        string description;
        uint256 price; // in wei (for USDC, this would be in 6 decimals)
        uint256 duration; // in seconds
        address paymentToken; // USDC, DAI, etc.
        address creator;
        bool active;
        string metadataURI;
    }
    
    struct Subscription {
        uint256 planId;
        address subscriber;
        uint256 tokenId;
        uint256 startTime;
        uint256 endTime;
        uint256 lastPayment;
        bool active;
    }
    
    mapping(uint256 => SubscriptionPlan) public plans;
    mapping(address => mapping(uint256 => Subscription)) public subscriptions; // subscriber => planId => subscription
    mapping(uint256 => Subscription) public tokenSubscriptions; // tokenId => subscription
    
    uint256 public planCounter;
    uint256 public platformFee = 250; // 2.5% in basis points
    address public feeRecipient;
    
    event PlanCreated(uint256 indexed planId, address indexed creator, string name, uint256 price);
    event Subscribed(address indexed subscriber, uint256 indexed planId, uint256 tokenId);
    event SubscriptionRenewed(address indexed subscriber, uint256 indexed planId, uint256 newEndTime);
    event SubscriptionCancelled(address indexed subscriber, uint256 indexed planId);
    
    constructor(address _feeRecipient) ERC721("Subscription NFT", "SUBNFT") {
        feeRecipient = _feeRecipient;
    }
    
    function createPlan(
        string memory _name,
        string memory _description,
        uint256 _price,
        uint256 _duration,
        address _paymentToken,
        string memory _metadataURI
    ) external returns (uint256) {
        planCounter++;
        
        plans[planCounter] = SubscriptionPlan({
            id: planCounter,
            name: _name,
            description: _description,
            price: _price,
            duration: _duration,
            paymentToken: _paymentToken,
            creator: msg.sender,
            active: true,
            metadataURI: _metadataURI
        });
        
        emit PlanCreated(planCounter, msg.sender, _name, _price);
        return planCounter;
    }
    
    function subscribe(uint256 _planId) external nonReentrant {
        SubscriptionPlan memory plan = plans[_planId];
        require(plan.active, "Plan not active");
        require(subscriptions[msg.sender][_planId].active == false, "Already subscribed");
        
        IERC20 paymentToken = IERC20(plan.paymentToken);
        uint256 totalAmount = plan.price;
        uint256 feeAmount = (totalAmount * platformFee) / 10000;
        uint256 creatorAmount = totalAmount - feeAmount;
        
        require(paymentToken.transferFrom(msg.sender, plan.creator, creatorAmount), "Payment to creator failed");
        require(paymentToken.transferFrom(msg.sender, feeRecipient, feeAmount), "Fee payment failed");
        
        _tokenIds.increment();
        uint256 newTokenId = _tokenIds.current();
        
        _mint(msg.sender, newTokenId);
        _setTokenURI(newTokenId, plan.metadataURI);
        
        uint256 endTime = block.timestamp + plan.duration;
        
        subscriptions[msg.sender][_planId] = Subscription({
            planId: _planId,
            subscriber: msg.sender,
            tokenId: newTokenId,
            startTime: block.timestamp,
            endTime: endTime,
            lastPayment: block.timestamp,
            active: true
        });
        
        tokenSubscriptions[newTokenId] = subscriptions[msg.sender][_planId];
        
        emit Subscribed(msg.sender, _planId, newTokenId);
    }
    
    function renewSubscription(uint256 _planId) external nonReentrant {
        Subscription storage sub = subscriptions[msg.sender][_planId];
        require(sub.active, "No active subscription");
        
        SubscriptionPlan memory plan = plans[_planId];
        require(plan.active, "Plan not active");
        
        IERC20 paymentToken = IERC20(plan.paymentToken);
        uint256 totalAmount = plan.price;
        uint256 feeAmount = (totalAmount * platformFee) / 10000;
        uint256 creatorAmount = totalAmount - feeAmount;
        
        require(paymentToken.transferFrom(msg.sender, plan.creator, creatorAmount), "Payment to creator failed");
        require(paymentToken.transferFrom(msg.sender, feeRecipient, feeAmount), "Fee payment failed");
        
        sub.endTime = block.timestamp + plan.duration;
        sub.lastPayment = block.timestamp;
        
        tokenSubscriptions[sub.tokenId] = sub;
        
        emit SubscriptionRenewed(msg.sender, _planId, sub.endTime);
    }
    
    function cancelSubscription(uint256 _planId) external {
        Subscription storage sub = subscriptions[msg.sender][_planId];
        require(sub.active, "No active subscription");
        
        sub.active = false;
        _burn(sub.tokenId);
        
        delete tokenSubscriptions[sub.tokenId];
        
        emit SubscriptionCancelled(msg.sender, _planId);
    }
    
    function isSubscriptionActive(address _subscriber, uint256 _planId) external view returns (bool) {
        Subscription memory sub = subscriptions[_subscriber][_planId];
        return sub.active && block.timestamp <= sub.endTime;
    }
    
    function getSubscription(address _subscriber, uint256 _planId) external view returns (Subscription memory) {
        return subscriptions[_subscriber][_planId];
    }
    
    function getPlan(uint256 _planId) external view returns (SubscriptionPlan memory) {
        return plans[_planId];
    }
    
    function setPlatformFee(uint256 _fee) external onlyOwner {
        require(_fee <= 1000, "Fee too high"); // Max 10%
        platformFee = _fee;
    }
    
    function setFeeRecipient(address _feeRecipient) external onlyOwner {
        feeRecipient = _feeRecipient;
    }
    
    function togglePlan(uint256 _planId) external {
        require(plans[_planId].creator == msg.sender, "Not plan creator");
        plans[_planId].active = !plans[_planId].active;
    }
    
    // Override transfer functions to make NFTs non-transferable (soulbound)
    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId,
        uint256 batchSize
    ) internal override {
        require(from == address(0) || to == address(0), "Token is non-transferable");
        super._beforeTokenTransfer(from, to, tokenId, batchSize);
    }
}
