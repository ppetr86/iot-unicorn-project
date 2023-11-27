import { useParams } from "react-router-dom";
import GlobalDataFetch from "../services/globalDataFetch";
import { Alert } from "bootstrap";

function Terrarium() {
  const { terrariumId } = useParams();
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

  const terrarium = data.data.terrariums.find(
    (terrarium) => terrarium._id === terrariumId
  );
  return (
    <>
      {isError && (
        <Alert variant="danger">{`Error fetching data: ${error}`}</Alert>
      )}
      {JSON.stringify(terrarium)}
    </>
  );
}

export default Terrarium;
