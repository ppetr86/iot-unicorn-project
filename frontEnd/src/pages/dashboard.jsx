import GlobalDataFetch from "../services/globalDataFetch";
import { Alert, Card, Col, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import TemperatureChart from "../components/charts/temperatureChart";

function Dashboard() {
  const { data, isLoading, isError, error } = GlobalDataFetch();

  if (isLoading) {
    return (
      <>
        <div className="container">
          <div className="d-flex align-items-center">
            <strong role="status">Loading...</strong>
            <div className="spinner-border ms-auto" aria-hidden="true"></div>
          </div>
        </div>
      </>
    );
  }
  const terrariums = data.data.terrariums;

  if (!terrariums || terrariums.length === 0) {
    return (
      <>
        <Alert variant="info">
          You do not have any terrarium yet. Please follow to the section{" "}
          <Link to={"/createTerrarium"}>Create terrarium</Link> .
        </Alert>
      </>
    );
  }

  return (
    <>
      {isError && (
        <Alert variant="danger">{`Error fetching data: ${error}`}</Alert>
      )}

      <div className="container">
        <section className="terrariumsCharts">
          <Row xs={1} md={2} className="g-4">
            {terrariums.map((terrarium, idx) => (
              <Col key={idx}>
                <Card key={terrarium._id}>
                  <Card.Body>
                    <Card.Title>{terrarium.name}</Card.Title>
                    <TemperatureChart terrarium={terrarium} />
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </section>
      </div>
    </>
  );
}

export default Dashboard;
