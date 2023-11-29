import { useParams } from "react-router-dom";
import GlobalDataFetch from "../services/globalDataFetch";
import { Alert, Button } from "react-bootstrap";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useContext } from "react";
import { LoginContext } from "../context/loginContext";
import { ApiService } from "../services/apiService";
import { useNavigate } from "react-router-dom";

function Terrarium() {
  const navigateTo = useNavigate();
  const { terrariumId } = useParams();
  const { data, isLoading, isError, error } = GlobalDataFetch();
  const queryClient = useQueryClient();
  let { userData, accessToken } = useContext(LoginContext);

  const mutation = useMutation({
    mutationFn: () => {
      return ApiService.deleteTerrarium(userData.id, terrariumId, accessToken);
    },
    onSuccess: () => {
      navigateTo("/dashboard");
      queryClient.invalidateQueries({ queryKey: ["getAllUserData"] });
    },
  });

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

  const handleDelete = () => {
    mutation.mutate({ title: "Delete terrarium" });
  };

  return (
    <>
      {isError && (
        <Alert variant="danger">{`Error fetching data: ${error}`}</Alert>
      )}
      <div className="container">
        <section className="searchAnimalType">
          {mutation.isError && (
            <Alert variant="danger">
              {`An error occurred: ${mutation.error.message}`}
            </Alert>
          )}
          {mutation.isSuccess && (
            <>
              <Alert variant="success">
                Terrarium has been successfully added!
              </Alert>
            </>
          )}
          <Button variant="danger" onClick={handleDelete}>
            Delete
          </Button>
        </section>
      </div>
      {JSON.stringify(terrarium)}
    </>
  );
}

export default Terrarium;
