import { useEffect, useState } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { LinkContainer } from "react-router-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { listCertificationDetails } from "../../actions/certificationActions";
import Loader from "../../components/Loader";
import Message from "../../components/Message";

const CertificationEditScreen = () => {
  const { id: certId } = useParams();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [type, setType] = useState("Organic");
  const [description, setDescription] = useState("");
  const [issuingAuthority, setIssuingAuthority] = useState("");
  const [isActive, setIsActive] = useState(true);

  const dispatch = useDispatch();

  const certificationDetails = useSelector(
    (state) => state.certificationDetails
  );
  const { loading, error, certification } = certificationDetails;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  useEffect(() => {
    if (!userInfo || !userInfo.isAdmin) {
      navigate("/login");
    }

    if (certId) {
      if (!certification || certification._id !== certId) {
        dispatch(listCertificationDetails(certId));
      } else {
        setName(certification.name);
        setType(certification.type);
        setDescription(certification.description);
        setIssuingAuthority(certification.issuingAuthority);
        setIsActive(certification.isActive);
      }
    }
  }, [dispatch, navigate, certId, certification, userInfo]);

  const submitHandler = (e) => {
    e.preventDefault();
    // Dispatch update/create action here
    console.log("Submit certification:", {
      name,
      type,
      description,
      issuingAuthority,
      isActive,
    });
  };

  return (
    <>
      <LinkContainer to="/admin/certifications">
        <Button className="my-3" variant="light">
          Go Back
        </Button>
      </LinkContainer>
      <Row>
        <Col md={8}>
          <h1>{certId ? "Edit Certification" : "Create Certification"}</h1>
          {loading ? (
            <Loader />
          ) : error ? (
            <Message variant="danger">{error}</Message>
          ) : (
            <Form onSubmit={submitHandler}>
              <Form.Group controlId="name">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter certification name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                ></Form.Control>
              </Form.Group>

              <Form.Group controlId="type">
                <Form.Label>Type</Form.Label>
                <Form.Control
                  as="select"
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                >
                  <option>Organic</option>
                  <option>Fair Trade</option>
                  <option>Non-GMO</option>
                  <option>Vegan</option>
                  <option>Gluten-Free</option>
                  <option>Other</option>
                </Form.Control>
              </Form.Group>

              <Form.Group controlId="description">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  placeholder="Enter description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                ></Form.Control>
              </Form.Group>

              <Form.Group controlId="issuingAuthority">
                <Form.Label>Issuing Authority</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter issuing authority"
                  value={issuingAuthority}
                  onChange={(e) => setIssuingAuthority(e.target.value)}
                ></Form.Control>
              </Form.Group>

              <Form.Group controlId="isActive">
                <Form.Check
                  type="checkbox"
                  label="Is Active"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                ></Form.Check>
              </Form.Group>

              <Button type="submit" variant="primary">
                {certId ? "Update" : "Create"}
              </Button>
            </Form>
          )}
        </Col>
      </Row>
    </>
  );
};

export default CertificationEditScreen;
