import React, { useState } from "react";
import { simpleStorage } from "./abi/abi";
import Web3 from "web3";
import "./App.css";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";

const useStyles = makeStyles((theme) => ({
 root: {
   "& > *": {
     margin: theme.spacing(1),
   },
 },
}));

async function createContract(myAccount, clientAccount, privateKey, itemId) {
  const address = clientAccount;
  const abi = simpleStorage;

  const infuraKey = "7c198036440346ab8eb3a8d389eef596";

  // Create infuara provider
  const provider = new Web3.providers.WebsocketProvider(
    `wss://ropsten.infura.io/ws/v3/${infuraKey}`
  );
  const web3 = new Web3(provider);

  // Add account from private key
  web3.eth.accounts.wallet.create(0, myAccount);

  const pk = privateKey;
  const account = web3.eth.accounts.privateKeyToAccount(pk);
  web3.eth.accounts.wallet.add(account);

  // Setup contract
  const contract = new web3.eth.Contract(abi, address);

  async function run() {
    const word = itemId;
    const from = web3.eth.accounts.wallet[0].address;

    const nonce = await web3.eth.getTransactionCount(from, "pending");
    let gas = await contract.methods
      .addWord(word)
      .estimateGas({ from, gas: "1000", value: "1000" });

    gas = Math.round(gas * 1.5);

    try {
      const result = await contract.methods.addWord(word).send({
        gas,
        from,
        nonce,
        value: "1000"
      });

      console.log("success", result);
    } catch (e) {
      console.log("error", e);
    }
  }

  run();
}

function App() {
  const classes = useStyles();
  const [myAccount, setMyAccountAddress] = useState("");
  const [clientAccount, setClientAccountAddress] = useState("");
  const [privateKey, setPrivateKey] = useState("");
  const [itemId, setItemId] = useState("");

  const numberSet = async (t) => {
    t.preventDefault();
    await createContract(myAccount, clientAccount, privateKey, itemId);
    alert("Sended successful");
  };

  return (
    <div className={classes.root}>
      <div className="main">
        <div className="card">
          <TextField
            id="outlined-basic"
            label="Your account address:"
            onChange={(t) => setMyAccountAddress(t.target.value)}
            variant="outlined"
          />
          <br/>
          <TextField
            id="outlined-basic"
            label="Client account address:"
            onChange={(t) => setClientAccountAddress(t.target.value)}
            variant="outlined"
          />
          <br/>
          <TextField
            id="outlined-basic"
            type="password"
            label="Your private key:"
            onChange={(t) => setPrivateKey(t.target.value)}
            variant="outlined"
          />
          <br/>
          <TextField
            id="outlined-basic"
            label="Your Item ID:"
            onChange={(t) => setItemId(t.target.value)}
            variant="outlined"
          />
          <br/>
          <form className="form" onSubmit={numberSet}>
            <Button
              variant="contained"
              color="primary"
              type="submit"
              value="Confirm"
            >
              Confirm
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default App;