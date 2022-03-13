
import logo from './logo.png';
import './App.css';
import {useState} from 'react';
import {ethers} from "ethers";
import MarketplaceAbi from '../contractsData/Marketplace.json';
import MarketplaceAddress from '../contractsData/Marketplace-address.json';
import ProductAbi from '../contractsData/Product.json'
import ProductAddress from '../contractsData/PRODUCT-address.json'
import Navigation from './Navbar';
import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";
import { Spinner } from 'react-bootstrap'
import Home from './Home';
import Create from './Create';
import MyListedItems from './MyListedItems';
import MyPurchases from './MyPurchases';

 
function App() {
  const [loading, setLoading] = useState(true);
  const [account, setAccount] = useState(null);
  const [product, setProduct] = useState({});
  const [marketplace, setMarketplace] = useState({})
  const web3Handler = async () => {
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts'})
    setAccount(accounts[0])
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner()
    loadContracts(signer)
  }

  const loadContracts = async (signer) => {
    const marketplace = new ethers.Contract(MarketplaceAddress.address, MarketplaceAbi.abi, signer)
    setMarketplace(marketplace)
    const product = new ethers.Contract(ProductAddress.address, ProductAbi.abi, signer)
    setProduct(product);
    setLoading(false)
  }

  return (
    <BrowserRouter>
    <div className="App">
      <Navigation web3Handler={web3Handler} account={account} />
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
        <Spinner animation="border" style={{ display: 'flex' }} />
        <p className='mx-3 my-0'>Awaiting Metamask Connection...</p>
      </div>
      ) : (

      <Routes>
        <Route path="/" element={ <Home marketplace={marketplace} product={product} /> } />
        <Route path="/create" element={ <Create marketplace={marketplace} product={product} /> }  />
        <Route path="/my-listed-items" element={ <MyListedItems marketplace={marketplace} product={product} account={account} />} />
        <Route path="/my-purchases" element={ <MyPurchases marketplace={marketplace} product={product} account={account} /> } />

      </Routes>
      )}

    </div>
    </BrowserRouter>
  );
}

export default App;
