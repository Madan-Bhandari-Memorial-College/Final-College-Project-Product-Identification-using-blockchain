import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useParams } from "react-router";
import StickyHeadTable from "./Table";
import { ethers } from "ethers"


import { Button } from "@material-ui/core";

const ProductDetail = ({ marketplace, product }) => {
  const { id } = useParams();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [offers, setOffers] = useState([])
  const [boughts, setBoughts] = useState([])

  const loadMarketplaceItems = async () => {
    // Load all unsold items
    let items = [];
    //   if (i.toString() == id) {
    const item = await marketplace.items(id);
    if (!item.sold) {
      // get uri url from product contract
      const uri = await product.tokenURI(item.tokenId);
      console.log("tokenID", item.tokenId)
      console.log("uri", uri)

      // use uri to fetch the product metadata stored on ipfs
      const response = await fetch(uri);
      const metadata = await response.json();
      console.log(item.nft)
      // get total price of item (item price + fee)
      const totalPrice = await marketplace.getTotalPrice(item.itemId);
      console.log(item.offeredDateTime);
      const filter = marketplace.filters.Offered(null, null, item.tokenId, null, null, null)
      const boughtFilter = marketplace.filters.Bought(null, null, item.tokenId, null, null, null, null)
      const boughtResults = await marketplace.queryFilter(boughtFilter);
      const boughts = await Promise.all(boughtResults.map(async i => {

        // fetch arguments from each result
        i = i.args
        console.log("args", i)
        // get uri url from product contract
        const uri = await product.tokenURI(i.tokenId)
        // use uri to fetch the product metadata stored on ipfs 
        const response = await fetch(uri)
        const metadata = await response.json()
        // get total price of item (item price + fee)
        const totalPrice = await marketplace.getTotalPrice(i.itemId)
        // define listed item object
        console.log("datetime", i.boughtDateTime)
        let boughtItem = {
          id: ethers.utils.formatEther(i.itemId),
          totalPrice,
          boughtDateTime: i.boughtDateTime,
          buyer: i.buyer,
          seller: i.seller
        }
        return boughtItem
      }))
      setBoughts(boughts);
      const results = await marketplace.queryFilter(filter)
      const offers = await Promise.all(results.map(async i => {

        // fetch arguments from each result
        i = i.args
        // console.log("args", i)
        // get uri url from product contract
        const uri = await product.tokenURI(i.tokenId)
        // use uri to fetch the product metadata stored on ipfs 
        const response = await fetch(uri)
        const metadata = await response.json()
        // get total price of item (item price + fee)
        const totalPrice = await marketplace.getTotalPrice(i.itemId)
        // define listed item object
        console.log("offer", i.offeredDateTime)
        let purchasedItem = {
          id: ethers.utils.formatEther(i.itemId),
          offeredDateTime: i.offeredDateTime,
          seller: i.seller,
          totalPrice
        }
        return purchasedItem
      }))
      setOffers(offers);
      console.log("nft", item.nft);
      // Add item to items array
      items.push({
        totalPrice,
        itemCount: id,
        itemId: item.itemId,
        seller: item.seller,
        name: metadata.name,
        description: metadata.description,
        image: metadata.image,
        offeredDateTime: item.offeredDateTime,
        deviceIdentificationNumber: metadata.deviceIdentificationNumber,
        purchaseDate: metadata.purchaseDate
      });
    }
    setItems(items);
    console.log(offers)
    //   }
    setLoading(false);

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

  const buyMarketItem = async (item) => {
    const currentDateTime = Math.round(new Date().getTime() / 1000);

    await (await marketplace.purchaseItem(item.itemId, currentDateTime, { value: item.totalPrice })).wait()
    console.log("call2")

    loadMarketplaceItems()
  }

  return (
    <>
      {items.length > 0 ?
        (<>
          <Container>

            {items.map((item, idx) => (
              <ProductContainer key={idx}>
                <ImgandDes>
                  <ProductImage src={item.image} alt="" />
                  <ProductDes>{item.description}</ProductDes>
                </ImgandDes>
                <Info>
                  <Brand>{item.productType}</Brand>
                  <h2>{item.name}</h2>
                  <Price>
                    <strong>Purchased On: </strong>{item.purchaseDate}
                    <br />
                    <strong>Price:</strong> {ethers.utils.formatEther(item.totalPrice)} ETH
                  </Price>
                  <p>
                    <strong>Identification Number:</strong>{" "}
                    {item.deviceIdentificationNumber}
                  </p>
                  <p>Owned By: </p><a href={`https://etherscan.io/address/+${item.seller}`}> {item.seller}</a>
                  <Button
                    style={{
                      backgroundColor: "",
                      Color: "#fffff",
                      margin: "10px 0px",
                    }}
                    variant="contained"
                    onClick={() => buyMarketItem(item)}
                  >
                    Buy Now
                  </Button>
                </Info>
              </ProductContainer>
            ))}
            <hr />
          </Container>
          <Container>
            <StickyHeadTable offers={offers} boughts={boughts} id={id} />
          </Container></>) : (
          <main style={{ padding: "1rem 0" }}>
            <h2>Not found</h2>
          </main>
        )}
    </>
  );
};
const Container = styled.div`
  height: auto;
  margin: 10px 80px;
`;
const ProductContainer = styled.div`
  display: grid;
  justify-content: space-evenly;
  grid-template-columns: 40% 60%;
  gap: 1em;
`;

const ImgandDes = styled.div`
  display: grid;
  grid-template-rows: 80% 20%;
  padding: 20px;
`;
const ProductDes = styled.p`
  margin-top: 20px;
  overflow: scroll;
  border-radius: 10px;
  border: 1px solid #c2c2c2;
  box-shadow: 1px 3px 14px -6px rgba(120, 120, 120, 1);
  -webkit-box-shadow: 1px 3px 14px -6px rgba(120, 120, 120, 1);
  -moz-box-shadow: 1px 3px 14px -6px rgba(120, 120, 120, 1);
`;
const ProductImage = styled.img`
  min-height: 300px;
  width: 100%;
  height: 95%;
  border-radius: 10px;
  border: 1px solid #c2c2c2;
  box-shadow: 1px 3px 14px -6px rgba(120, 120, 120, 1);
  -webkit-box-shadow: 1px 3px 14px -6px rgba(120, 120, 120, 1);
  -moz-box-shadow: 1px 3px 14px -6px rgba(120, 120, 120, 1);
`;
const Info = styled.div`
  height: 70%;
  display: flex;
  flex-direction: column;
  // grid-template-rows: repeat(4,auto);
  margin-top: 20px;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  border: 1px solid #c2c2c2;
  box-shadow: 1px 3px 14px -6px rgba(120, 120, 120, 1);
  -webkit-box-shadow: 1px 3px 14px -6px rgba(120, 120, 120, 1);
  -moz-box-shadow: 1px 3px 14px -6px rgba(120, 120, 120, 1);
`;
const Brand = styled.h1`
  font-weight: 1000;
`;
const Price = styled.p`
  margin: 20px 0;
  font-weight: 600;
`;

export default ProductDetail;
