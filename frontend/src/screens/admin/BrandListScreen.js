import React, { useEffect } from "react";
import { Button, Col, Row, Table } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { LinkContainer } from "react-router-bootstrap";
import { listBrands } from "../../actions/brandActions";
import Loader from "../../components/Loader";
import Message from "../../components/Message";

const BrandListScreen = ({ history }) => {
  const dispatch = useDispatch();

  const brandList = useSelector((state) => state.brandList);
  const { loading, error, brands } = brandList;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  useEffect(() => {
    if (userInfo && userInfo.isAdmin) {
      dispatch(listBrands());
    } else {
      history.push("/login");
    }
  }, [dispatch, history, userInfo]);

  return (
    <>
      <Row className="align-items-center">
        <Col>
          <h1>Brands</h1>
        </Col>
        <Col className="text-right">
          <LinkContainer to="/admin/brands/create">
            <Button className="my-3">
              <i className="fas fa-plus"></i> Create Brand
            </Button>
          </LinkContainer>
        </Col>
      </Row>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <Table striped bordered hover responsive className="table-sm">
          <thead>
            <tr>
              <th>ID</th>
              <th>NAME</th>
              <th>VERIFIED</th>
              <th>RATING</th>
              <th>PRODUCTS</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {brands.map((brand) => (
              <tr key={brand._id}>
                <td>{brand._id.substring(0, 10)}...</td>
                <td>{brand.name}</td>
                <td>
                  {brand.isVerified ? (
                    <i className="fas fa-check" style={{ color: "green" }}></i>
                  ) : (
                    <i className="fas fa-times" style={{ color: "red" }}></i>
                  )}
                </td>
                <td>{brand.rating}</td>
                <td>{brand.totalProducts}</td>
                <td>
                  <LinkContainer to={`/admin/brands/${brand._id}/edit`}>
                    <Button variant="light" className="btn-sm">
                      <i className="fas fa-edit"></i>
                    </Button>
                  </LinkContainer>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </>
  );
};

export default BrandListScreen;
