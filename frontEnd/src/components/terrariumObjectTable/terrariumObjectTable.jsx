import { Table, Accordion } from "react-bootstrap";
import React from "react";

const excludeKeys = ["humidity", "lightIntensity", "data", "_id", "__v"];

const keyMappings = {
  name: "Name",
  animalType: "Animal Type",
  description: "Description",
  hardwarioCode: "Hardwario Code",
};

const TerrariumObjectTable = ({ obj }) => {
  if (!obj || typeof obj !== "object") {
    return null; // Return null or an error message if obj is null/undefined or not an object
  }
  const filteredKeys = Object.keys(obj).filter(
    (key) => !excludeKeys.includes(key)
  );

  return (
    <>
      <Accordion>
        <Accordion.Item eventKey="0">
          <Accordion.Header>Detail of: {obj.name} </Accordion.Header>
          <Accordion.Body>
            <Table striped bordered hover>
              <tbody>
                {filteredKeys.map((key) => {
                  const displayKey = keyMappings[key] || key;
                  if (key === "targetLivingConditions") {
                    return (
                      <React.Fragment key={`${key}_fragment`}>
                        <tr key={`${key}_min`}>
                          <td>Temperature Min</td>
                          <td>
                            {obj[key]?.temperature?.min}
                            {" °C"}
                          </td>
                        </tr>
                        <tr key={`${key}_max`}>
                          <td>Temperature Max</td>
                          <td>
                            {obj[key]?.temperature?.max}
                            {" °C"}
                          </td>
                        </tr>
                      </React.Fragment>
                    );
                  } else {
                    return (
                      <tr key={key}>
                        <td>{displayKey}</td>
                        <td>{JSON.stringify(obj[key])}</td>
                      </tr>
                    );
                  }
                })}
              </tbody>
            </Table>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    </>
  );
};

export default TerrariumObjectTable;
