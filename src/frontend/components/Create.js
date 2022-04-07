import { useState } from "react";
import { ethers } from "ethers";
import { Row, Form, Button, Col, Card } from "react-bootstrap";
import { create as ipfsHttpClient } from "ipfs-http-client";
import Sidebar from "./components/Sidebar";
import styled from "styled-components";

const client = ipfsHttpClient("https://ipfs.infura.io:5001/api/v0");

const Create = ({ marketplace, product }) => {
  const [image, setImage] = useState("");
  const [price, setPrice] = useState(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [purchaseDate, setPurchaseDate] = useState("");

  const [productType, setProductType] = useState("");
  const [vehicleNo, setVehicleNo] = useState("");
  const [lotNo, setLotNo] = useState("");
  const [deviceIdentificationNumber, setDeviceIdentificationNumber] = useState("");
  const [propertyVerificationNumber, setPropertyVerificationNumber] = useState("");
  const [errMsg, setErrMsg] = useState("");

  const uploadToIPFS = async (event) => {
    event.preventDefault();
    const file = event.target.files[0];
    if (typeof file !== "undefined") {
      try {
        const result = await client.add(file);
        console.log(result);
        setImage(`https://ipfs.infura.io/ipfs/${result.path}`);
      } catch (error) {
        console.log("ipfs image upload error: ", error);
      }
    }
  };
  const createProduct = async () => {
    if (!image || !price || !name || !description) return;
    try {
      const result = await client.add(
        JSON.stringify({ image, price, name, description, productType, vehicleNo, lotNo, deviceIdentificationNumber, propertyVerificationNumber, purchaseDate })
      );
      mintThenList(result);
    } catch (error) {
      console.log("ipfs uri upload error: ", error);
    }
  };
  const mintThenList = async (result) => {
    const uri = `https://ipfs.infura.io/ipfs/${result.path}`;
    // mint Product
    await (await product.mint(uri)).wait();
    // get tokenId of new Product
    const id = await product.tokenCount();
    // approve marketplace to spend Product
    await (await product.setApprovalForAll(marketplace.address, true)).wait();
    // add Product to marketplace
    const listingPrice = ethers.utils.parseEther(price.toString());
    const currentDateTime = Math.round(new Date().getTime() / 1000);
    console.log(currentDateTime)
    await (
      await marketplace.makeItem(product.address, id, listingPrice, currentDateTime)
    ).wait();
  };

  const handleProductTypeChange = (e) => {
    setProductType(e.target.value);
  };

  const handleDeviceIdentificationNumberChange = (e) => {
    if (e.target.value.length == 15) {
      setDeviceIdentificationNumber(e.target.value)
      setErrMsg("");
    } else {
      setErrMsg("Device Identification length must be equal to 15")
    }
  }

  const renderSelectedForm = (param) => {
    switch (param) {
      case "vehicle":
        return (
          <div>

            <Row>

              <Col>
                <label className="text-dark">Engine Number</label>
                <Form.Control
                  onChange={(e) => setLotNo(e.target.value)}
                  size="lg"
                  required
                  type="text"
                /></Col>
              <Col>
                <label className="text-dark">Chasis Number</label>

                <Form.Control
                  onChange={(e) => setVehicleNo(e.target.value)}
                  size="lg"
                  required
                  type="text"
                />
              </Col>

            </Row>
            <br />
            <Col>
              <Button className="primary">Verify</Button>
            </Col>

          </div >
        );
      case "electronic_device":
        return (
          <div>
            <Row>
              <Col>
                <label className="text-dark">Device Identification Number(such as: IMEI)</label>
                <Form.Control
                  onChange={handleDeviceIdentificationNumberChange}
                  size="lg"
                  required
                  type="text"
                /></Col>
            </Row>
            <br />
            <Col>
              <Button className="primary">Verify</Button>
            </Col>
          </div>
        );;
      case "real_estate":
        return (<div>
          <Row>
            <Col>
              <label className="text-dark">Property verification Number</label>
              <Form.Control
                onChange={(e) => setPropertyVerificationNumber(e.target.value)}
                size="lg"
                required
                type="text"
              /></Col>

          </Row>
          <br />
          <Col>
            <Button className="primary">Verify</Button>
          </Col>
        </div>);
      default:
        return null;
    }
  };
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
                    <label className="text-dark">File</label>
                    <Form.Control
                      type="file"
                      required
                      name="file"
                      onChange={uploadToIPFS}
                    />
                    <label className="text-dark">Name</label>
                    <Form.Control
                      onChange={(e) => setName(e.target.value)}
                      size="lg"
                      required
                      type="text"
                      placeholder="Name"
                    />
                    <label className="text-dark">Product Type</label>

                    <Form.Select
                      value={productType}
                      onChange={handleProductTypeChange}
                      aria-label="Default select example"
                    >
                      <option>Select Product Type</option>
                      <option value="vehicle">Vehicles</option>
                      <option value="electronic_device">
                        Electronic Devices
                      </option>
                      <option value="real_estate">Real Estate Property</option>
                    </Form.Select>
                    <Col>
                      <Form.Control size="lg" required type="text" placeholder="Phone Number">
                      </Form.Control>
                    </Col>
                    <label className="text-danger">{errMsg}</label>
                    {renderSelectedForm(productType)}
                    <label className="text-dark">Purchase Date</label>
                    <Form.Control
                      onChange={(e) => setPurchaseDate(e.target.value)}
                      size="lg"
                      required
                      type="date"
                      placeholder="purchaseDate"
                    />
                    <label className="text-dark">Description</label>

                    <Form.Control
                      onChange={(e) => setDescription(e.target.value)}
                      size="lg"
                      required
                      as="textarea"
                      placeholder="Description"
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
                      <Button onClick={createProduct} variant="primary" size="lg">
                        Create & List Product!
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

export default Create;

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
  overflow-y: scroll;
`;
