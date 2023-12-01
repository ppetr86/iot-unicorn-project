import { Modal, Button, Form, Alert, Spinner } from "react-bootstrap";
import PropTypes from "prop-types";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { useState, useEffect } from "react";

import { ApiService } from "../../services/apiService";
import FormValidation from "../validation/formValidation";

function EditTerrariumModal(props) {
  const [state, setState] = useState({
    name: "",
    animalType: "",
    description: "",
    targetLivingConditions: {
      humidity: {
        min: 0,
        max: 0,
      },
      temperature: {
        min: "",
        max: "",
      },
      lightIntensity: {
        min: 0,
        max: 0,
      },
    },
    hardwarioCode: "",
  });
  const [validationErrors, setValidationErrors] = useState({
    animalType: "",
    name: "",
    description: "",
    temperatureMin: "",
    temperatureMax: "",
    hardwarioCode: "",
  });
  const queryClient = useQueryClient();

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
      queryClient.invalidateQueries({ queryKey: ["getAllUserData"] });
    },
  });

  const handleSubmit = () => {
    setValidationErrors({});

    if (FormValidation(state)) {
      setValidationErrors(FormValidation(state));
      return;
    }

    mutation.mutate({ title: "Edit terrarium" });
  };

  useEffect(() => {
    setState((prev) => ({ ...prev, ...props.terrarium }));
    if (props.isOpen) {
      mutation.reset();
      setValidationErrors({});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.isOpen, props.terrarium]);

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

  if (mutation.isSuccess) {
    return (
      <>
        <Modal show={props.isOpen} onHide={props.closeModal}>
          <Modal.Header closeButton>
            <Modal.Title>Edit terrarium</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Alert variant="success">
              Terrarium has been successfully edited!
            </Alert>
          </Modal.Body>
        </Modal>
      </>
    );
  }
  return (
    <>
      <Modal show={props.isOpen} onHide={props.closeModal}>
        <Modal.Header closeButton>
          <Modal.Title>Edit terrarium</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="editTerrariumName">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={state.name}
                onChange={updateInput}
                isInvalid={validationErrors.name}
              />
              <Form.Control.Feedback type="invalid">
                {validationErrors.name}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group controlId="editTerrariumAnimalType">
              <Form.Label>Animal Type</Form.Label>
              <Form.Control
                type="text"
                name="animalType"
                value={state.animalType}
                onChange={updateInput}
                isInvalid={validationErrors.animalType}
              />
              <Form.Control.Feedback type="invalid">
                {validationErrors.animalType}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group controlId="editTerrariumDescription">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                name="description"
                value={state.description}
                onChange={updateInput}
                isInvalid={validationErrors.description}
              />
              <Form.Control.Feedback type="invalid">
                {validationErrors.description}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group controlId="editTerrariumHardwarioCode">
              <Form.Label>Hardwario Code</Form.Label>
              <Form.Control
                type="text"
                name="hardwarioCode"
                value={state.hardwarioCode}
                onChange={updateInput}
                isInvalid={validationErrors.hardwarioCode}
              />
              <Form.Control.Feedback type="invalid">
                {validationErrors.hardwarioCode}
              </Form.Control.Feedback>
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
                isInvalid={validationErrors.temperatureMin}
              />
              <Form.Control.Feedback type="invalid">
                {validationErrors.temperatureMin}
              </Form.Control.Feedback>
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
                isInvalid={validationErrors.temperatureMax}
              />
              <Form.Control.Feedback type="invalid">
                {validationErrors.temperatureMax}
              </Form.Control.Feedback>
            </Form.Group>
            {mutation.isPending ? (
              <Button
                className="mb-1 mt-2"
                variant="primary"
                type="button"
                disabled
              >
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                />
                Uploading...
              </Button>
            ) : (
              <>
                {mutation.isError && (
                  <Alert variant="danger" className="mb-1 mt-1">
                    {`An error occurred: ${
                      mutation.error.message
                    }: ${JSON.stringify(mutation.error.response.data)}`}
                  </Alert>
                )}

                <Button
                  className="mb-1 mt-1"
                  variant="primary"
                  onClick={handleSubmit}
                >
                  Save Changes
                </Button>
              </>
            )}
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
  terrarium: PropTypes.object,
  userData: PropTypes.object.isRequired,
};
export default EditTerrariumModal;
