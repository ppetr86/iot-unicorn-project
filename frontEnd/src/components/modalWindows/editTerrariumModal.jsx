import { Modal, Button, Form } from "react-bootstrap";
import PropTypes from "prop-types";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ApiService } from "../../services/apiService";

function EditTerrariumModal(props) {
  const [state, setState] = useState(props.terrarium);
  const queryClient = useQueryClient();
  const navigateTo = useNavigate();
  const mutation = useMutation({
    mutationFn: () => {
      return ApiService.editTerrarium(
        state,
        props.userData.id,
        props.terrarium._id,
        props.accessToken
      );
    },
    onSuccess: () => {
      navigateTo("/dashboard");
      queryClient.invalidateQueries({ queryKey: ["getAllUserData"] });
    },
  });

  const handleSubmit = () => {
    mutation.mutate({ title: "Edit terrarium" });
  };
  const updateInput = (event) => {
    let { value, name } = event.target;
    const field = event.target.dataset.field;
    const subField = event.target.dataset.subfield;

    if (field && subField) {
      setState((prevState) => ({
        ...prevState,
        [field]: {
          ...prevState[field],
          [subField]: {
            ...prevState.targetLivingConditions[subField],
            [name]: parseFloat(value),
          },
        },
      }));
    } else {
      setState((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  return (
    <>
      <Modal show={props.isOpen} onHide={props.closeModal}>
        <Modal.Header closeButton>
          <Modal.Title>Edit terrarium</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {JSON.stringify(state)}
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="editTerrariumName">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={state.name}
                onChange={updateInput}
              />
            </Form.Group>
            <Form.Group controlId="editTerrariumAnimalType">
              <Form.Label>Animal Type</Form.Label>
              <Form.Control
                type="text"
                name="animalType"
                value={state.animalType}
                onChange={updateInput}
              />
            </Form.Group>
            <Form.Group controlId="editTerrariumDescription">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                name="description"
                value={state.description}
                onChange={updateInput}
              />
            </Form.Group>
            <Form.Group controlId="editTerrariumHardwarioCode">
              <Form.Label>Hardwario Code</Form.Label>
              <Form.Control
                type="text"
                name="hardwarioCode"
                value={state.hardwarioCode}
                onChange={updateInput}
              />
            </Form.Group>
            <Form.Group controlId="editTerrariumTemperatureMin">
              <Form.Label>Temperature Min</Form.Label>
              <Form.Control
                type="number"
                name="min"
                value={state.targetLivingConditions.temperature.min}
                onChange={updateInput}
                data-field="targetLivingConditions"
                data-subfield="temperature"
              />
            </Form.Group>
            <Form.Group controlId="editTerrariumTemperatureMax">
              <Form.Label>Temperature Max</Form.Label>
              <Form.Control
                type="number"
                name="max"
                value={state.targetLivingConditions.temperature.max}
                onChange={updateInput}
                data-field="targetLivingConditions"
                data-subfield="temperature"
              />
            </Form.Group>

            <Button
              className="mb-1 mt-2"
              variant="primary"
              onClick={handleSubmit}
            >
              Save Changes
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
}
EditTerrariumModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  closeModal: PropTypes.func.isRequired,
  accessToken: PropTypes.string.isRequired,
  terrarium: PropTypes.object.isRequired,
};
export default EditTerrariumModal;
