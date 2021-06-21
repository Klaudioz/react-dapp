import './App.css';
import { useState } from 'react';
import { ethers } from 'ethers'
import Greeter from './artifacts/contracts/Greeter.sol/Greeter.json'

// Update with the contract address logged out to the CLI when it was deployed 
const greeterAddress = "0xe7f1725e7734ce288f8367e1bb143e90bb3f0512" // It's a public and test address. It's not dangerous

function App() {
  // store greeting in local state
  const [greeting, setGreetingValue] = useState('')

  // request access to the user's MetaMask account
  async function requestAccount() {
    await window.ethereum.request({ method: 'eth_requestAccounts' }); // Requesting account information from Metamask
  }

  // call the smart contract, read the current greeting value
  async function fetchGreeting() {
    if (typeof window.ethereum !== 'undefined') { // Looking for Metamask extension to inject this code
      const provider = new ethers.providers.Web3Provider(window.ethereum) // Using the Web3Provider provider but there are more
      const contract = new ethers.Contract(greeterAddress, Greeter.abi, provider) // Creating an instance of the contract
      try {
        const data = await contract.greet()
        console.log('data: ', data)
      } catch (err) {
        console.log("Error: ", err)
      }
    }    
  }

  // call the smart contract, send an update
  async function setGreeting() {
    if (!greeting) return // Checking if there is already a greeting
    if (typeof window.ethereum !== 'undefined') { // Checking Metamask window
      await requestAccount() // Waiting for connected account from user
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner() // To be able to sign a transaction
      const contract = new ethers.Contract(greeterAddress, Greeter.abi, signer) // New instance of the contract but this time using the signer
      const transaction = await contract.setGreeting(greeting) // Passing the local greeting passed by the user
      setGreetingValue('')
      await transaction.wait() // Waiting for the transaction be confirmed onto the blockchain
      fetchGreeting() // Getting the new value
    }
  }

  return ( // Super basic UI
    <div className="App">
      <header className="App-header">
        <button onClick={fetchGreeting}>Fetch Greeting</button>
        <button onClick={setGreeting}>Set Greeting</button>
        <input onChange={e => setGreetingValue(e.target.value)} placeholder="Set greeting" value={greeting}/>
      </header>
    </div>
  );
}

export default App;