import { useState, useEffect, useContext } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ApiService } from "../services/apiService";
import { Button, Alert, Form, Spinner, Col, Row } from "react-bootstrap";
import { LoginContext } from "../context/loginContext";

function CreateTerrarium() {
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  let { userData, accessToken } = useContext(LoginContext);
  const [state, setState] = useState({
    loading: false,
    newTerrarium: {
      name: "",
      animalType: "",
      description: "",
      targetLivingConditions: {
        humidity: {
          min: 0,
          max: 0,
        },
        temperature: {
          min: null,
          max: null,
        },
        lightIntensity: {
          min: 0,
          max: 0,
        },
      },
      hardwarioCode: "",
    },
    allAnimalTypes: [],
    searchResultAnimalTypes: [],
  });
  const [validationErrors, setValidationErrors] = useState({
    animalType: "",
    name: "",
    description: "",
    temperatureMin: "",
    temperatureMax: "",
    hardwarioCode: "",
  });

  // ------ Prepared DATA FETCHING ---------
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["animalData"],
    queryFn: async () => {
      const response = await ApiService.getAllAnimalKinds();

      return response.data;
    },
    staleTime: Infinity,
    cacheTime: Infinity,
  });

  const mutation = useMutation({
    mutationFn: (newTerrarium) => {
      return ApiService.createNewTerrarium(
        state.newTerrarium,
        userData.id,
        accessToken,
        newTerrarium
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getAllUserData"] });
    },
  });

  useEffect(() => {
    if (data) {
      setState((prevState) => ({
        ...prevState,
        allAnimalTypes: data.data,
        searchResultAnimalTypes: data.data,
      }));
    }
  }, [data]);

  const handleCreateNewTerrarium = () => {
    setValidationErrors({});
    const { newTerrarium } = state;

    // Validation
    if (
      !newTerrarium.name ||
      !newTerrarium.animalType ||
      !newTerrarium.description ||
      !newTerrarium.targetLivingConditions ||
      !newTerrarium.targetLivingConditions.temperature ||
      !newTerrarium.targetLivingConditions.temperature.min ||
      !newTerrarium.targetLivingConditions.temperature.max ||
      !newTerrarium.hardwarioCode ||
      newTerrarium.targetLivingConditions.temperature.min < -100 ||
      newTerrarium.targetLivingConditions.temperature.min > 100 ||
      newTerrarium.targetLivingConditions.temperature.max < -100 ||
      newTerrarium.targetLivingConditions.temperature.max > 100
    ) {
      setValidationErrors({
        name: !newTerrarium.name,
        animalType: !newTerrarium.animalType,
        description: !newTerrarium.description,
        temperatureMin: !newTerrarium.targetLivingConditions.temperature.min,
        temperatureMax: !newTerrarium.targetLivingConditions.temperature.max,
        hardwarioCode: !newTerrarium.hardwarioCode,
      });
      if (newTerrarium.targetLivingConditions.temperature.min === 0) {
        setValidationErrors((prevState) => ({
          ...prevState,
          temperatureMin: false,
        }));
      }
      if (newTerrarium.targetLivingConditions.temperature.max === 0) {
        setValidationErrors((prevState) => ({
          ...prevState,
          temperatureMax: false,
        }));
      }
      if (
        newTerrarium.targetLivingConditions.temperature.min < -100 ||
        newTerrarium.targetLivingConditions.temperature.min > 100
      ) {
        setValidationErrors((prevState) => ({
          ...prevState,
          temperatureMin: "Out of range (+-100°C)",
        }));
      }
      if (
        newTerrarium.targetLivingConditions.temperature.max < -100 ||
        newTerrarium.targetLivingConditions.temperature.max > 100
      ) {
        setValidationErrors((prevState) => ({
          ...prevState,
          temperatureMax: "Out of range (+-100°C)",
        }));
      }
      if (
        newTerrarium.targetLivingConditions.temperature.max <=
        newTerrarium.targetLivingConditions.temperature.min
      ) {
        setValidationErrors((prevState) => ({
          ...prevState,
          temperatureMax: "Max temperature should be higher than the min temp.",
        }));
      }

      return;
    }

    mutation.mutate({ title: "New terrarium" });
  };
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
              ...prevState.newTerrarium.targetLivingConditions[subField],
              [name]: parseFloat(value),
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
  const handleAnimalTypeSelect = (e) => {
    let result = state.searchResultAnimalTypes.find(
      (element) => element._id === e.target.value
    );
    if (result) {
      setState((prevState) => ({
        ...prevState,
        newTerrarium: {
          ...prevState.newTerrarium,
          // Copy values from 'result' that exist in 'newTerrarium' structure
          ...Object.keys(prevState.newTerrarium).reduce((acc, key) => {
            if (Object.prototype.hasOwnProperty.call(result, key)) {
              acc[key] = result[key];
            } else {
              acc[key] = prevState.newTerrarium[key];
            }
            return acc;
          }, {}),
        },
      }));
    } else {
      setState((prevState) => ({
        ...prevState,
        newTerrarium: {
          ...prevState.newTerrarium,
          animalType: "",
          description: "",
          targetLivingConditions: {
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
        },
      }));
    }
  };
  const resetForm = () => {
    mutation.reset();
    setState((prevState) => ({
      ...prevState,
      newTerrarium: {
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
      },
    }));
    setValidationErrors({
      animalType: "",
      name: "",
      description: "",
      temperatureMin: "",
      temperatureMax: "",
      hardwarioCode: "",
    });
  };

  const handleSearch = () => {
    if (!searchQuery) {
      setState((prevState) => ({
        ...prevState,
        searchResultAnimalTypes: state.allAnimalTypes,
      }));
    } else {
      const result = state.allAnimalTypes.filter((animal) =>
        animal.animalType.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setState((prevState) => ({
        ...prevState,
        searchResultAnimalTypes: result,
      }));
    }
  };

  return (
    <>
      {isError && (
        <Alert variant="danger">{`Error fetching data: ${error}`}</Alert>
      )}

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
                  disabled={isLoading}
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
                onChange={handleAnimalTypeSelect}
                size="5"
              >
                <option value="">
                  {isLoading ? "Loading..." : "Select animal type"}
                </option>
                {state.searchResultAnimalTypes.map((animalType) => (
                  <option key={animalType._id} value={animalType._id}>
                    {`${animalType.animalType} - ${animalType.description}`}
                  </option>
                ))}
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
                  data-field="targetLivingConditions"
                  data-subfield="temperature"
                  name="min"
                  value={
                    state.newTerrarium.targetLivingConditions.temperature.min
                  }
                  onChange={updateInput}
                  isInvalid={validationErrors.temperatureMin}
                  min={-100}
                  max={100}
                />

                <Form.Control.Feedback type="invalid">
                  Please enter a valid min temperature value.{" "}
                  {validationErrors.temperatureMin}
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group className="col-md-6 mb-1 mt-2">
                <Form.Label>Temperature max</Form.Label>
                <Form.Control
                  type="number"
                  id="tempMax"
                  placeholder="Enter max temperature (°C)"
                  required
                  data-field="targetLivingConditions"
                  data-subfield="temperature"
                  name="max"
                  value={
                    state.newTerrarium.targetLivingConditions.temperature.max
                  }
                  onChange={updateInput}
                  isInvalid={validationErrors.temperatureMax}
                  min={-100}
                  max={100}
                />

                <Form.Control.Feedback type="invalid">
                  Please enter a valid max temperature value.{" "}
                  {validationErrors.temperatureMax}
                </Form.Control.Feedback>
              </Form.Group>
            </Row>
            <Row>
              <Col>
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
                    <Button
                      className="mb-1 mt-2"
                      variant="primary"
                      onClick={handleCreateNewTerrarium}
                    >
                      Create Terrarium
                    </Button>{" "}
                    <Button
                      className="mb-1 mt-2"
                      variant="warning"
                      onClick={resetForm}
                    >
                      Clear Form
                    </Button>
                  </>
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
