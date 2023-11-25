import GlobalDataFetch from "../services/globalDataFetch";
import { Alert } from "bootstrap";

function Dashboard() {
  const { data, isLoading, isError, error } = GlobalDataFetch();

  return (
    <>
      {isError && (
        <Alert variant="danger">{`Error fetching data: ${error}`}</Alert>
      )}
      <div className="container">
        {isLoading ? (
          <div className="d-flex align-items-center">
            <strong role="status">Loading...</strong>
            <div className="spinner-border ms-auto" aria-hidden="true"></div>
          </div>
        ) : (
          <section className="terrariumsCharts">
            <p>Terrariums: {`${JSON.stringify(data.data.terrariums)}`}</p>
          </section>
        )}
      </div>
    </>
  );
}

export default Dashboard;
