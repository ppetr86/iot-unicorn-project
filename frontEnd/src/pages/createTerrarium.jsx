import { useState } from "react";
import { useQuery } from "react-query";
import { ApiService } from "../services/apiService";
import { Button, Alert, Form, Spinner, Col, Row } from "react-bootstrap";

function CreateTerrarium() {
  const [searchQuery, setSearchQuery] = useState();
  const [state, setState] = useState({
    loading: false,
    newTerrarium: {
      name: "",
      animalType: "",
      description: "",
      livingConditions: {
        humidity: {
          min: "",
          max: "",
        },
        temperature: {
          min: "",
          max: "",
        },
        lightIntensity: {
          min: "",
          max: "",
        },
      },
      hardwarioCode: "",
    },
  });
  const [validationErrors, setValidationErrors] = useState({
    animalType: "",
    name: "",
    description: "",
    temperatureMin: "",
    temperatureMax: "",
    hardwarioCode: "",
  });
  const { data, isLoading, isError } = useQuery("animalData", async () => {
    const response = await ApiService.getAllAnimalKinds();
    return response.data;
  });

  const handleNewTerrarium = () => {};
  const updateInput = (event) => {
    let { value, name } = event.target;
    const field = event.target.dataset.field;
    const subField = event.target.dataset.subfield;

    if (field && subField) {
      setState((prevState) => ({
        ...prevState,
        newTerrarium: {
          ...prevState.newTerrarium,
          [field]: {
            ...prevState.newTerrarium[field],
            [subField]: {
              ...prevState.newTerrarium.livingConditions[subField],
              [name]: value,
            },
          },
        },
      }));
    } else {
      setState((prevState) => ({
        ...prevState,
        newTerrarium: {
          ...prevState.newTerrarium,
          [name]: value,
        },
      }));
    }
  };
  const handleSearch = () => {};

  return (
    <>
      {isError && <Alert variant="danger">Error fetching data</Alert>}
      {/* <div>Animal kind data: {JSON.stringify(data)}</div> */}
      {JSON.stringify(state)}
      <div className="container">
        <section className="searchAnimalType">
          <Row>
            <Form.Group className="col-md-6 mb-1 mt-2" controlId="searchQuery">
              <Form.Label>Search for animal type:</Form.Label>
              <div className="d-flex form-outline">
                <Form.Control
                  type="text"
                  placeholder="Animal type"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Button
                  variant="primary"
                  onClick={handleSearch}
                  className="ms-2"
                >
                  Search
                </Button>
              </div>
            </Form.Group>

            <div className="col-md-6 mb-1 mt-2">
              <Form.Label htmlFor="listOfAnimalTypes">
                Search results:
              </Form.Label>
              <select
                id={"listOfAnimalTypes"}
                className="form-select"
                aria-label="Select animal type"
                // onChange={(e) =>
                //   setState((prevState) => ({
                //     ...prevState,
                //     animalId: e.target.value,
                //   }))
                // }
                size="5"
                //   value={newTerrarium.animalId || ""}
              >
                <option value="">Select animal type</option>
                {/* {animalTypes.map((animalType) => (
                  <option key={animalType._id} value={animalType._id}>
                    {animalType.name}
                  </option>
                ))} */}
              </select>
            </div>
          </Row>
        </section>
        <section className="newTerrariumForm">
          <Form>
            <Row>
              <Form.Group className="col-md-6 mb-1 mt-2">
                <Form.Label>Terrarium name</Form.Label>
                <Form.Control
                  type="string"
                  id="terrariumName"
                  placeholder="Enter name of terrarium"
                  required
                  name="name"
                  value={state.newTerrarium.name}
                  onChange={updateInput}
                  isInvalid={validationErrors.name}
                />
                <Form.Control.Feedback type="invalid">
                  Please enter a valid terrarium name.
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group className="col-md-6 mb-1 mt-2">
                <Form.Label>Animal type</Form.Label>
                <Form.Control
                  type="string"
                  id="animalType"
                  placeholder="Enter animal type"
                  required
                  name="animalType"
                  value={state.newTerrarium.animalType}
                  onChange={updateInput}
                  isInvalid={validationErrors.animalType}
                />
                <Form.Control.Feedback type="invalid">
                  Please enter a valid animal type.
                </Form.Control.Feedback>
              </Form.Group>
            </Row>
            <Row>
              <Form.Group className="col-md-6 mb-1 mt-2">
                <Form.Label>Animal description</Form.Label>
                <Form.Control
                  type="string"
                  id="description"
                  placeholder="Enter animal description"
                  required
                  name="description"
                  value={state.newTerrarium.description}
                  onChange={updateInput}
                  isInvalid={validationErrors.description}
                />
                <Form.Control.Feedback type="invalid">
                  Please enter a valid description.
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group className="col-md-6 mb-1 mt-2">
                <Form.Label>Hardwario code</Form.Label>
                <Form.Control
                  type="string"
                  id="hardwarioCode"
                  placeholder="Enter the code of your hardwario device"
                  required
                  name="hardwarioCode"
                  value={state.newTerrarium.hardwarioCode}
                  onChange={updateInput}
                  isInvalid={validationErrors.hardwarioCode}
                />

                <Form.Control.Feedback type="invalid">
                  Please enter a valid hardwario code.
                </Form.Control.Feedback>
              </Form.Group>
            </Row>
            <Row>
              <Form.Group className="col-md-6 mb-1 mt-2">
                <Form.Label>Temperature min</Form.Label>
                <Form.Control
                  type="number"
                  id="tempMin"
                  placeholder="Enter min temperature (°C)"
                  required
                  data-field="livingConditions"
                  data-subfield="temperature"
                  name="min"
                  value={state.newTerrarium.livingConditions.temperature.min}
                  onChange={updateInput}
                  isInvalid={validationErrors.temperatureMin}
                />

                <Form.Control.Feedback type="invalid">
                  Please enter a valid min temperature value.
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group className="col-md-6 mb-1 mt-2">
                <Form.Label>Temperature max</Form.Label>
                <Form.Control
                  type="number"
                  id="tempMax"
                  placeholder="Enter max temperature (°C)"
                  required
                  data-field="livingConditions"
                  data-subfield="temperature"
                  name="max"
                  value={state.newTerrarium.livingConditions.temperature.max}
                  onChange={updateInput}
                  isInvalid={validationErrors.temperatureMax}
                />

                <Form.Control.Feedback type="invalid">
                  Please enter a valid max temperature value.
                </Form.Control.Feedback>
              </Form.Group>
            </Row>
            <Row>
              <Col>
                {state.loading ? (
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
                    Loading...
                  </Button>
                ) : (
                  <Button
                    className="mb-1 mt-2"
                    variant="primary"
                    onClick={handleNewTerrarium}
                  >
                    Create Terrarium
                  </Button>
                )}
              </Col>
            </Row>
          </Form>
        </section>
      </div>
    </>
  );
}

export default CreateTerrarium;
