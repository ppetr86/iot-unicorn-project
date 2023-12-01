import { Modal, Button, Form, Alert, Spinner } from "react-bootstrap";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { ApiService } from "../../services/apiService";

function CreateTerrariumToken(props) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: () => {
      return ApiService.editTerrarium(
        props.userData.id,
        props.terrarium._id,
        props.accessToken
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getAllUserData"] });
    },
  });
  return (
    <>
      <Modal show={props.isOpen} onHide={props.closeModal}>
        <Modal.Header closeButton>
          <Modal.Title>{`Get new JWT token for terrarium: ${props.terrarium.name}`}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Button>Confirmar!</Button>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default CreateTerrariumToken;
