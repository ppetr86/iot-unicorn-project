import { useParams } from "react-router-dom";
import GlobalDataFetch from "../services/globalDataFetch";
import { Alert, Button } from "react-bootstrap";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useContext, useState } from "react";
import { LoginContext } from "../context/loginContext";
import { ApiService } from "../services/apiService";
import { useNavigate } from "react-router-dom";
import EditTerrariumModal from "../components/modalWindows/editTerrariumModal";

function Terrarium() {
  const navigateTo = useNavigate();
  const { terrariumId } = useParams();
  const { data, isLoading, isError, error } = GlobalDataFetch();
  const queryClient = useQueryClient();
  let { userData, accessToken } = useContext(LoginContext);
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const mutation = useMutation({
    mutationFn: () => {
      return ApiService.deleteTerrarium(userData.id, terrariumId, accessToken);
    },
    onSuccess: () => {
      navigateTo("/dashboard");
      queryClient.invalidateQueries({ queryKey: ["getAllUserData"] });
    },
  });

  const openModal = () => {
    setModalIsOpen(true);
  };
  const closeModal = () => {
    setModalIsOpen(false);
  };

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
    if (
      window.confirm(
        "Are you sure? By deleting terrarium all its data will be lost."
      )
    ) {
      mutation.mutate({ title: "Delete terrarium" });
    }
  };

  return (
    <>
      <EditTerrariumModal
        id="dressCreateModal"
        isOpen={modalIsOpen}
        closeModal={closeModal}
        accessToken={accessToken}
        userData={userData}
        terrarium={terrarium}
      />
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
          </Button>{" "}
          <Button variant="primary" onClick={openModal}>
            Edit
          </Button>
        </section>
      </div>
      {JSON.stringify(terrarium)}
    </>
  );
}

export default Terrarium;
