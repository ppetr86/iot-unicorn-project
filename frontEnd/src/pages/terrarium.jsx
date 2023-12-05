import { useParams } from "react-router-dom";
import GlobalDataFetch from "../services/globalDataFetch";
import { Alert, Button } from "react-bootstrap";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useContext, useState, useEffect, useRef } from "react";
import { LoginContext } from "../context/loginContext";
import { ApiService } from "../services/apiService";
import { useNavigate } from "react-router-dom";
import EditTerrariumModal from "../components/modalWindows/editTerrariumModal";
import TerrariumObjectTable from "../components/terrariumObjectTable/terrariumObjectTable";
import CreateTerrariumToken from "../components/modalWindows/createTerrariumToken";
import Chart from "chart.js/auto";
import "chartjs-adapter-date-fns";
import annotationPlugin from "chartjs-plugin-annotation";

function Terrarium() {
  const navigateTo = useNavigate();
  const { terrariumId } = useParams();
  const { data, isLoading, isError, error } = GlobalDataFetch();
  const queryClient = useQueryClient();
  let { userData, accessToken } = useContext(LoginContext);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [jwtTerrariumIsOpen, setJwtTerrariumIsOpen] = useState(false);
  const [terrarium, setTerrarium] = useState();

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
  const openJwtModal = () => {
    setJwtTerrariumIsOpen(true);
  };
  const closeJwtModal = () => {
    setJwtTerrariumIsOpen(false);
  };

  useEffect(() => {
    if (data) {
      setTerrarium(
        data.data.terrariums.find((terrarium) => terrarium._id === terrariumId)
      );
    }
  }, [data, terrariumId]);

  // function generateFakeData() {
  //   if (!terrarium) return;
  //   const data = [];
  //   const currentDate = new Date();
  //   const weekAgo = new Date();
  //   weekAgo.setDate(currentDate.getDate() - 7);

  //   while (weekAgo < currentDate) {
  //     const timestamp = new Date(weekAgo);
  //     const value =
  //       Math.floor(
  //         Math.random() *
  //           (terrarium.targetLivingConditions.temperature.max -
  //             terrarium.targetLivingConditions.temperature.min +
  //             1)
  //       ) + terrarium.targetLivingConditions.temperature.min;
  //     const type = "temperature";
  //     data.push({ timestamp, value, type });

  //     weekAgo.setTime(weekAgo.getTime() + 30 * 60 * 1000);
  //   }

  //   return data;
  // }

  useEffect(() => {
    // Create a line chart

    if (terrarium && terrarium.data) {
      console.log(terrarium);
      Chart.register(annotationPlugin);
      const ctx = document.getElementById("myChart").getContext("2d");
      const myChart = new Chart(ctx, {
        type: "line",
        data: {
          datasets: [
            {
              label: "Temperature Data",
              data: terrarium.data.map((item) => ({
                x: item.timestamp,
                y: item.value,
              })),
              borderColor: "rgb(75, 192, 192)",
              tension: 0.1,
            },
          ],
        },
        options: {
          plugins: {
            annotation: {
              annotations: [
                {
                  type: "line",
                  mode: "horizontal",
                  scaleID: "y",
                  value: terrarium.targetLivingConditions.temperature.min, // Value where you want to draw the horizontal line
                  borderColor: "red",
                  borderWidth: 1,
                  label: {
                    content: "Threshold", // Label for the line
                    enabled: true,
                    position: "right",
                  },
                },
                {
                  type: "line",
                  mode: "horizontal",
                  scaleID: "y",
                  value: terrarium.targetLivingConditions.temperature.max,
                  borderColor: "red",
                  borderWidth: 1,
                  label: {
                    content: "Threshold 2",
                    enabled: true,
                    position: "right",
                  },
                },
              ],
            },
          },
          scales: {
            x: {
              type: "time",
              time: {
                unit: "day",
              },
              title: {
                display: true,
                text: "Time",
              },
            },
            y: {
              title: {
                display: true,
                text: "Temperature",
              },

              suggestedMin:
                terrarium.targetLivingConditions.temperature.min -
                (terrarium.targetLivingConditions.temperature.max -
                  terrarium.targetLivingConditions.temperature.min) /
                  10, // Set minimum value for Y-axis
              suggestedMax:
                terrarium.targetLivingConditions.temperature.max +
                (terrarium.targetLivingConditions.temperature.max -
                  terrarium.targetLivingConditions.temperature.min) /
                  10, // Set maximum value for Y-axis
              // You can also set step size, ticks, and other configurations here
            },
          },
        },
      });

      return () => {
        myChart.destroy();
      };
    }
  }, [terrarium]);

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

  const handleDelete = () => {
    if (
      window.confirm(
        "Are you sure? By deleting terrarium all its data will be lost."
      )
    ) {
      mutation.mutate({ title: "Delete terrarium" });
    }
  };

  const resetMutation = () => {
    mutation.reset();
  };

  return (
    <>
      {data && (
        <>
          <EditTerrariumModal
            id="editTerrariumModal"
            isOpen={modalIsOpen}
            closeModal={closeModal}
            accessToken={accessToken}
            userData={userData}
            terrarium={terrarium}
            resetMutation={resetMutation}
          />
          <CreateTerrariumToken
            id="createTerrariumToken"
            isOpen={jwtTerrariumIsOpen}
            closeModal={closeJwtModal}
            accessToken={accessToken}
            userData={userData}
            terrarium={terrarium}
            resetMutation={resetMutation}
          />
        </>
      )}

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
          </Button>{" "}
          <Button variant="primary" onClick={openJwtModal}>
            Generate new JWT
          </Button>
        </section>
        <section>
          <TerrariumObjectTable obj={terrarium} />
        </section>
        <section>
          {" "}
          <canvas id="myChart" width="400" height="200"></canvas>
        </section>
      </div>
    </>
  );
}

export default Terrarium;
