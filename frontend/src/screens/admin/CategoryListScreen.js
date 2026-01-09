import { useEffect } from "react";
import { Button, Col, Row, Table } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { LinkContainer } from "react-router-bootstrap";
import { useNavigate } from "react-router-dom";
import { listCategories } from "../../actions/categoryActions";
import Loader from "../../components/Loader";
import Message from "../../components/Message";

const CategoryListScreen = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const categoryList = useSelector((state) => state.categoryList);
  const { loading, error, categories } = categoryList;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  useEffect(() => {
    if (userInfo && userInfo.isAdmin) {
      dispatch(listCategories());
    } else {
      navigate("/login");
    }
  }, [dispatch, navigate, userInfo]);

  const deleteHandler = (id) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      // Dispatch delete action here
      console.log("Delete category:", id);
    }
  };

  return (
    <>
      <Row className="align-items-center">
        <Col>
          <h1>Categories</h1>
        </Col>
        <Col className="text-right">
          <LinkContainer to="/admin/categories/create">
            <Button className="my-3">
              <i className="fas fa-plus"></i> Create Category
            </Button>
          </LinkContainer>
        </Col>
      </Row>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <>
          <Table striped bordered hover responsive className="table-sm">
            <thead>
              <tr>
                <th>ID</th>
                <th>NAME</th>
                <th>SLUG</th>
                <th>DESCRIPTION</th>
                <th>ACTIVE</th>
                <th>ORDER</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {categories.map((category) => (
                <tr key={category._id}>
                  <td>{category._id}</td>
                  <td>{category.name}</td>
                  <td>{category.slug}</td>
                  <td>{category.description.substring(0, 50)}...</td>
                  <td>
                    {category.isActive ? (
                      <i
                        className="fas fa-check"
                        style={{ color: "green" }}
                      ></i>
                    ) : (
                      <i className="fas fa-times" style={{ color: "red" }}></i>
                    )}
                  </td>
                  <td>{category.displayOrder}</td>
                  <td>
                    <LinkContainer
                      to={`/admin/categories/${category._id}/edit`}
                    >
                      <Button variant="light" className="btn-sm">
                        <i className="fas fa-edit"></i>
                      </Button>
                    </LinkContainer>
                    <Button
                      variant="danger"
                      className="btn-sm"
                      onClick={() => deleteHandler(category._id)}
                    >
                      <i className="fas fa-trash"></i>
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </>
      )}
    </>
  );
};

export default CategoryListScreen;
