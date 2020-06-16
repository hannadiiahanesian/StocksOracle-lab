pragma solidity ^0.6.0;

contract StocksMarket {
    struct stocks {
        uint256 stocksPrice;
        uint256 stocksVolume;
    }

    mapping (bytes4 => stocks) stocksQuote;
    address oracleOwner;

    constructor() public {
        oracleOwner = msg.sender;
    }

    function stockSet (bytes4 _symbol, uint256 _price, uint256 _volume) public {
        require(msg.sender == oracleOwner, "StockOracle: Only owner can call this function");
        stocksQuote[_symbol].stocksPrice = _price;
        stocksQuote[_symbol].stocksVolume = _volume;
    }

    function getStocksPrice (bytes4 _symbol) public view returns(uint256) {
        return (stocksQuote[_symbol].stocksPrice);
    }
    function getStocksVolume (bytes4 _symbol) public view returns(uint256) {
        return  (stocksQuote[_symbol].stocksVolume);
    }
}
