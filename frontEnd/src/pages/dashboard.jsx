import GlobalDataFetch from "../services/globalDataFetch";
import { Alert } from "react-bootstrap";
import { Link } from "react-router-dom";

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
  console.log(terrariums);

  if (!terrariums || terrariums.length === 0) {
    return (
      <>
        <Alert variant="info">
          You do not have any terrarium yet. Please follow to the section{" "}
          <Link to={"/createTerrarium"}>"Create terrarium"</Link> .
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
          <p>Terrariums: {`${JSON.stringify(data.data.terrariums)}`}</p>
        </section>
      </div>
    </>
  );
}

export default Dashboard;
