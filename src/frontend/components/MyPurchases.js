import { useState, useEffect } from 'react'
import {
  Link
} from "react-router-dom";
import { Navbar, Nav, Button, Container } from 'react-bootstrap'
import { Row, Col, Card } from 'react-bootstrap'
import Sidebar from './components/Sidebar';
import styled from "styled-components";

export default function MyPurchases({ marketplace, product, account }) {
  const [loading, setLoading] = useState(true)
  const [purchases, setPurchases] = useState([])
  const loadPurchasedItems = async () => {
    // Fetch purchased items from marketplace by quering Offered events with the buyer set as the user
    const filter =  marketplace.filters.Bought(null,null,null,null,null,account)
    console.log("filter", filter)
    const results = await marketplace.queryFilter(filter)
    //Fetch metadata of each product and add that to listedItem object.
    const purchases = await Promise.all(results.map(async i => {
      console.log(i)
      // fetch arguments from each result
      i = i.args
      // get uri url from product contract
      const uri = await product.tokenURI(i.tokenId)
      // use uri to fetch the product metadata stored on ipfs 
      const response = await fetch(uri)
      const metadata = await response.json()
      // get total price of item (item price + fee)
      const totalPrice = await marketplace.getTotalPrice(i.itemId)
      // define listed item object
      let purchasedItem = {
        totalPrice,
        price: i.price,
        itemId: i.itemId,
        name: metadata.name,
        description: metadata.description,
        image: metadata.image
      }
      return purchasedItem
    }))
    setLoading(false)
    setPurchases(purchases)
  }
  useEffect(() => {
    loadPurchasedItems()
  }, [])
  if (loading) return (
    <Wrapper>
      <Sidebar />
      <MainContainer>
    <main style={{ padding: "1rem 0" }}>
      <h2>Loading...</h2>
    </main>
    </MainContainer>
    </Wrapper>
  )
  return (
    <Wrapper>
      <Sidebar />
      <MainContainer>
    <div className="flex justify-center">
      {purchases.length > 0 ?
        <div className="px-5 container">
          <Row xs={1} md={2} lg={4} className="g-4 py-5">
            {purchases.map((item, idx) => (
              <Col key={idx} className="overflow-hidden">
                <Card>
                  <Card.Img variant="top" src={item.image} />
                  <Card.Footer>
                  <div className='d-grid'>
                  <Nav.Link as={Link} to={"/product-resale/" + item.itemId} className='text-dark'>
                      <Button variant="primary" size="lg">
                        Resale
                      </Button>
                  </Nav.Link>
                    </div>
                  </Card.Footer>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
        : (
          <main style={{ padding: "1rem 0" }}>
            <h2>No purchases</h2>
          </main>
        )}
    </div>
    </MainContainer>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: flex;
  height: 100vh;
  width: 100vw;
  background-color: #0a0b0d;
  color: white;
  overflow: hidden;
`;

const MainContainer = styled.div`
  flex: 1;
`;