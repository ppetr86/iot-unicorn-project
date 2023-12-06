import { Modal, Button, Form, Alert, Spinner } from "react-bootstrap";
import { useQuery } from "@tanstack/react-query";
import { ApiService } from "../../services/apiService";
import { useEffect } from "react";

function CreateTerrariumToken(props) {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["iotToken"],
    queryFn: async () => {
      const response = await ApiService.getIotToken(props.accessToken);

      return response.data.data;
    },

    staleTime: Infinity,
    cacheTime: Infinity,
    enabled: !!props.isOpen,
  });

  return (
    <>
      <Modal show={props.isOpen} onHide={props.closeModal}>
        <Modal.Header closeButton>
          <Modal.Title>Get JWT token</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ wordBreak: "break-all" }}>
          {isLoading && (
            <>
              <div className="d-flex align-items-center">
                <strong role="status">Loading...</strong>
                <div
                  className="spinner-border ms-auto"
                  aria-hidden="true"
                ></div>
              </div>
            </>
          )}
          {isError && (
            <Alert variant="danger">{`Error fetching data: ${error}`}</Alert>
          )}
          {data && (
            <>
              <h6>JWT token for your gateway is: </h6>
              <Alert variant="success">{`${data}`}</Alert>
            </>
          )}
        </Modal.Body>
      </Modal>
    </>
  );
}

export default CreateTerrariumToken;
