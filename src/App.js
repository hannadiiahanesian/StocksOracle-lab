import React, { useState, useEffect } from "react";
import logo from "./logo.svg";
import "./App.css";
import Web3 from "web3";
import { STOCK_ORACLE_ABI, STOCK_ORACLE_ADDRESS } from "./quotes";

const apiKey = "Z3P0ELPMNCF1ESBV";
const port = 8545;
const web3 = new Web3("http://localhost:" + port);

function App() {
  return (
    <div className="App">
      <div className="AppContent">
        <StockApp></StockApp>
      </div>
    </div>
  );
}

function StockApp() {
  const [price, getPrice] = useState(0);
  const [volume, getVolume] = useState(0);
  const [symbol, getSymbol] = useState("");
  const [oraclePrice, getOraclePrice] = useState("undefined");
  const [oracleVolume, getOracleVolume] = useState("undefined");
  const [response, setResponse] = useState(" ");
  const [responseClass, setResponseClass] = useState("");

  let accounts = [];

  const clearResponses = () => {
    setResponseClass("");
    setResponse("");
  };
  const stocksOracle = new web3.eth.Contract(
    STOCK_ORACLE_ABI,
    STOCK_ORACLE_ADDRESS
  );

  useEffect(() => {}, [symbol]);

  const getApi = () => {
    clearResponses();

    if (!symbol) {
      setResponse("Undefined symbol.");
      setResponseClass("textRefused");
      return;
    }

    setResponse("API called");
    setResponseClass("muted");
    fetch(
      "https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=" + symbol + "&apikey=KEY"
    )
      .then((res) => res.json())
      .then((data) => {
        if (data === undefined) {
          setResponse("Nothing found for this symbol.");
          setResponseClass("textRefused");
          return;
        }
        setResponse("Data fetched");
        setResponseClass("success");
        getPrice(data["Global Quote"]["05. price"]);
        getVolume(data["Global Quote"]["06. volume"]);
      })
      .catch((err) => {
        setResponse("API issue: check your api key");
        setResponseClass("textRefused");
        console.error(err);
        getPrice(0);
        getVolume(0);
      });
  };

  const getOracle = async () => {
    clearResponses();

    if (!price && !volume) {
      setResponseClass("textRefused");
      setResponse("Nothing received");
      return;
    }

    setResponseClass("muted");
    setResponse(`Setting up data from oracle ${accounts[0]}`);
    accounts = await web3.eth.getAccounts();
    let contractOwner = accounts[0];

    const transaction = await stocksOracle.methods
      .setStock(
        web3.utils.fromAscii(symbol),
        Math.round(Number(price) * 10000),
        Number(volume)
      )
      .send({ from: contractOwner });

    if (transaction) {
      setResponseClass("success");
      setResponse(`transaction received, transaction hash: ${transaction["blockHash"]}`);
    } else {
      setResponseClass("textRefused");
      setResponse(
        "Something wrong, no data received."
      );
    }
  };

  const getFromOracle = async () => {
    clearResponses();

    accounts = await web3.eth.getAccounts();
    let contractOwner = accounts[0];
    if (contractOwner === 0x0) {
      setResponseClass("textRefused");
      setResponse("Not able to connect to blockchain");
    }

    setResponseClass("muted");
    setResponse(`Oracle getting data from ${accounts[0]}`);

    stocksOracle.methods
      .getStockPrice(web3.utils.fromAscii(symbol))
      .call({ from: contractOwner })
      .then((oraclePrice) => {
        getOraclePrice(oraclePrice);
      });

    stocksOracle.methods
      .getStockVolume(web3.utils.fromAscii(symbol))
      .call({ from: contractOwner })
      .then((oracleVolume) => {
        getOracleVolume(oracleVolume);
        setResponseClass("success");
        setResponse(
          `Data received from contract address ${STOCK_ORACLE_ADDRESS}`
        );
      });
  };

  return (
    <div>
      <div>
        <p className={responseClass}>{response}</p>
        <h1>Stocks Oracle</h1>
        <div>
          <div>
            <input type="text" className="form-control" placeholder="Input symbol" onChange={(event) =>getSymbol(event.target.value)}></input>
            <br>
            </br>
            <button type="button" className="button" onClick={getApi}> Get price from API </button>
            <button className="button" onClick={getOracle}> Add to the Oracle </button>
            <button className="button" onClick={getFromOracle}> Get price from the Oracle </button>
          </div>

          <div>
            <div>
              <div>API Data</div>
              <div>
                <h4>Stock Information</h4>
                <p>
                  Symbol: {symbol} <br />
                  Price : {price} <br /> Volume: {volume}
                </p>
              </div>
            </div>
          </div>
          <div>
            <div>
              <div>Oracle Data</div>
              <div>
                <h4>Oracle Stock Information</h4>
                <p>
                  Symbol: {symbol} <br />
                  Oracle Price: {oraclePrice} <br /> Oracle Volume:
                  {oracleVolume}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
