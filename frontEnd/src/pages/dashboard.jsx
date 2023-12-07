import GlobalDataFetch from "../services/globalDataFetch";
import { Alert, Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import TemperatureChart from "../components/charts/temperatureChart";
import { useRef } from "react";

function Dashboard() {
  const { data, isLoading, isError, error } = GlobalDataFetch();
  const ref = useRef();

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
          {terrariums.map((terrarium) => (
            <Card key={terrarium.id}>
              <Card.Body>
                <Card.Title>{terrarium.name}</Card.Title>
                <TemperatureChart
                  id={terrarium.id}
                  ref={ref}
                  terrarium={terrarium}
                />
              </Card.Body>
            </Card>
          ))}
        </section>
      </div>
    </>
  );
}

export default Dashboard;
