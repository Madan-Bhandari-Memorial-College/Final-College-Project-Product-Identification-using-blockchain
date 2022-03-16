import React, { useState, useEffect } from "react";
import { useParams } from "react-router";
import { ethers } from "ethers";
import { Row, Form, Button, Col, Card } from "react-bootstrap";
import { create as ipfsHttpClient } from "ipfs-http-client";
import Sidebar from "./Sidebar";
import styled from "styled-components";

const client = ipfsHttpClient("https://ipfs.infura.io:5001/api/v0");


const ProductResold = ({ marketplace, product }) => {
  const { id } = useParams();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [price, setPrice] = useState(true);
  const [description, setDescription] = useState("");
  const [name, setName] = useState("");

  const loadMarketplaceItems = async () => {
    // Load all unsold items
    let items = [];

    //   if (i.toString() == id) {
    const item = await marketplace.items(id);
    
      // get uri url from product contract
    const uri = await product.tokenURI(item.tokenId);
    console.log(product.addrress);
    // use uri to fetch the product metadata stored on ipfs
    const response = await fetch(uri);
    const metadata = await response.json();
    console.log(item.nft);
    // get total price of item (item price + fee)
    const totalPrice = await marketplace.getTotalPrice(item.itemId);
    // Add item to items array
    items.push({
    totalPrice,
    itemCount: id,
    itemId: item.itemId,
    seller: item.seller,
    name: metadata.name,
    nft: item.nft,
    description: metadata.description,
    image: metadata.image,
    deviceIdentificationNumber: metadata.deviceIdentificationNumber,
    lotNo: metadata.lotNo,
    vehicleNo: metadata.vehicleNo,
    propertyVerificationNumber: metadata.propertyVerificationNumber,
    deviceIdentificationNumber: metadata.deviceIdentificationNumber,
    productType: metadata.productType
    });
    
    setItems(items);
    setDescription(items[0].description)
    setName(items[0].name)

    //   }
    setLoading(false);
  };

  const resaleProduct = async () => {
    const image = items[0].image;
    const price = items[0].price;
    const lotNo = items[0].lotNo;
    const vehicleNo = items[0].vehicleNo;
    const propertyVerificationNumber = items[0].propertyVerificationNumber;
    const deviceIdentificationNumber = items[0].deviceIdentificationNumber
    const productType = items[0].productType;
    const nft = items[0].nft;
    try {
      const result = await client.add(
        JSON.stringify({ image, price, name, description, productType, vehicleNo, lotNo, deviceIdentificationNumber, propertyVerificationNumber })
      );
      mintThenList(result, nft);
    } catch (error) {
      console.log("ipfs uri upload error: ", error);
    }
  };
  const mintThenList = async (result, nft) => {
    const uri = `https://ipfs.infura.io/ipfs/${result.path}`;
    // mint Product
    await (await product.mint(uri)).wait();
    // get tokenId of new Product
    const id = await product.tokenCount();
    // approve marketplace to spend Product
    await (await product.setApprovalForAll(marketplace.address, true)).wait();
    // add Product to marketplace
    const listingPrice = ethers.utils.parseEther(price.toString());
    const currentDateTime = Math.round(new Date().getTime()/1000);
    await (
      await marketplace.makeItem(nft, id, listingPrice, currentDateTime)
    ).wait();
  };

  const renderSelectedForm = (param) => {
    switch (param) {
      case "vehicle":
        return (
          <div>
            <Row>
            <label className="text-dark">Lot No</label>
            <Col><Form.Control
              size="lg"
              required
              type="text"
              placeholder="Lot No."
              value={items[0].lotNo}
              disabled
            /></Col>
            <Col>
            <label className="text-dark">Vehicle No</label>

            <Form.Control
              size="lg"
              required
              type="text"
              placeholder="Vehicle No."
              value={items[0].vehicleNo}
              disabled
            />
            </Col>
            </Row>
          </div>
        );
      case "electronic_device":
        return (
          <div>
            <Row>
            <label className="text-dark">Device Identification Number</label>
            <Col><Form.Control
              size="lg"
              required
              type="text"
              placeholder="Device Identification Number(such as: IMEI)"
              value={items[0].deviceIdentificationNumber}
              disabled
            /></Col>
            
            </Row>
          </div>
        );;
      case "real_estate":
        return (<div>
        <Row>
        <label className="text-dark">Property Verification Number</label>
        <Col><Form.Control
          size="lg"
          required
          type="text"
          placeholder="Property verification Number"
          value={items[0].propertyVerificationNumber}
          disabled
        /></Col>
        
        </Row>
      </div>);
      default:
        return null;
    }
  };

  useEffect(() => {
    loadMarketplaceItems();
  }, []);
  if (loading)
    return (
      <main style={{ padding: "1rem 0" }}>
        <h2>Loading...</h2>
      </main>
    );

  return (
    <Wrapper>
      <Sidebar />
      <MainContainer>
        <div className="container-fluid mt-5">
          <div className="row">
            <main
              role="main"
              className="col-lg-6 mx-auto"
              style={{ maxWidth: "1000px" }}
            >
              <div className="content mx-auto">
                  <Card className="p-4">
                <Row className="g-4">
                  <img src={items[0].image} height="200px" />
                  <label className="text-dark">Name</label>
                  <Form.Control
                    onChange={(e) => setName(e.target.value)}
                    size="lg"
                    required
                    type="text"
                    placeholder="Name"
                    currentValue={items[0].name}
                  />
                  <label className="text-dark">Type of Product</label>

                  <Form.Control
                    value={items[0].productType}
                    aria-label="Default select example"
                    disabled
                  />
                  {renderSelectedForm(items[0].productType)}
                  <label className="text-dark">Description</label>

                  <Form.Control
                    onChange={(e) => setDescription(e.target.value)}
                    size="lg"
                    required
                    as="textarea"
                    placeholder="Description"
                    currentValue={items[0].description}
                  />
                  <label className="text-dark">Price</label>

                  <Form.Control
                    onChange={(e) => setPrice(e.target.value)}
                    size="lg"
                    required
                    type="number"
                    
                    placeholder="Price in ETH"
                  />
                  <div className="d-grid px-0">
                    <Button onClick={resaleProduct} variant="primary" size="lg">
                      Resale Product
                    </Button>
                  </div>
                </Row>
                </Card>
              </div>
            </main>
          </div>
        </div>
      </MainContainer>
    </Wrapper>
  );
};

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

export default ProductResold;
