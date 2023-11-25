import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { ApiService } from "../services/apiService";
import { Button, Alert, Form, Spinner, Col, Row } from "react-bootstrap";

const fakeData = {
  data: [
    {
      _id: "17865464",
      animalType: "Snake",
      description: "Cobra",
      livingConditions: {
        humidity: {
          min: "",
          max: "",
        },
        temperature: {
          min: 15,
          max: 35,
        },
        lightIntensity: {
          min: "",
          max: "",
        },
      },
    },
    {
      _id: "254646444",
      animalType: "Mouse",
      description: "Mickey",
      livingConditions: {
        humidity: {
          min: "",
          max: "",
        },
        temperature: {
          min: 5,
          max: 30,
        },
        lightIntensity: {
          min: "",
          max: "",
        },
      },
    },
    {
      _id: "3445565",
      animalType: "Snake",
      description: "Anaconda",
      livingConditions: {
        humidity: {
          min: "",
          max: "",
        },
        temperature: {
          min: 10,
          max: 39,
        },
        lightIntensity: {
          min: "",
          max: "",
        },
      },
    },
  ],
};

function CreateTerrarium() {
  const [searchQuery, setSearchQuery] = useState("");
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

  // Delete when using API
  const isError = false;
  let [isLoading, setIsLoading] = useState(false);

  //------ Prepared DATA FETCHING ---------
  //   const { data, isLoading, isError } = useQuery("animalData", async () => {
  //     const response = await ApiService.getAllAnimalKinds();

  //     console.log(response);
  //     return response.data;
  //   },
  // {staleTime: Infinity,
  //   cacheTime: Infinity}
  //   );

  let data = fakeData;

  useEffect(() => {
    if (data) {
      // Delete when using API - Keep just setState
      setIsLoading(true);
      setTimeout(() => {
        setState((prevState) => ({
          ...prevState,
          allAnimalTypes: data.data,
          searchResultAnimalTypes: data.data,
        }));
        setIsLoading(false);
      }, 3000);
    }
  }, [data]);

  const handleNewTerrarium = () => {
    setValidationErrors({});
    const { newTerrarium } = state;

    // Validation
    if (
      !newTerrarium.name ||
      !newTerrarium.animalType ||
      !newTerrarium.description ||
      !newTerrarium.livingConditions ||
      !newTerrarium.livingConditions.temperature ||
      !newTerrarium.livingConditions.temperature.min ||
      !newTerrarium.livingConditions.temperature.max ||
      !newTerrarium.hardwarioCode ||
      newTerrarium.livingConditions.temperature.min < -100 ||
      newTerrarium.livingConditions.temperature.min > 100 ||
      newTerrarium.livingConditions.temperature.max < -100 ||
      newTerrarium.livingConditions.temperature.max > 100
    ) {
      setValidationErrors({
        name: !newTerrarium.name,
        animalType: !newTerrarium.animalType,
        description: !newTerrarium.description,
        livingConditions: !newTerrarium.livingConditions,
        temperatureMin:
          !newTerrarium.livingConditions?.temperature?.min ||
          newTerrarium.livingConditions.temperature.min < -100 ||
          newTerrarium.livingConditions.temperature.min > 100,
        temperatureMax:
          !newTerrarium.livingConditions?.temperature?.max ||
          newTerrarium.livingConditions.temperature.max < -100 ||
          newTerrarium.livingConditions.temperature.max > 100,
        hardwarioCode: !newTerrarium.hardwarioCode,
      });
      return;
    }

    //Delete when using API
    const jsonState = JSON.stringify(state.newTerrarium, null, 2);
    const newWindow = window.open("", "_blank");
    newWindow.document.write("<pre>" + jsonState + "</pre>");
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
        },
      }));
    }
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
        <Alert variant="danger">{`Error fetching data: ${isError.message}`}</Alert>
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
                  data-field="livingConditions"
                  data-subfield="temperature"
                  name="min"
                  value={state.newTerrarium.livingConditions.temperature.min}
                  onChange={updateInput}
                  isInvalid={validationErrors.temperatureMin}
                  min={-100}
                  max={100}
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
                  min={-100}
                  max={100}
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
