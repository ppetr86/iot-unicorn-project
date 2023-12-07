import { useEffect } from "react";
import Chart from "chart.js/auto";
import annotationPlugin from "chartjs-plugin-annotation";
import "chartjs-adapter-date-fns";
import "chart.js/auto";

function TemperatureChart({ terrarium }) {
  useEffect(() => {
    if (terrarium && terrarium.data) {
      const filteredTemperatureData = terrarium.data.filter(
        (item) => item.type === "temperature"
      );

      Chart.register(annotationPlugin);
      const ctx = document.getElementById("myChart").getContext("2d");

      const myChart = new Chart(ctx, {
        type: "line",
        data: {
          datasets: [
            {
              label: "Temperature Data",
              data: filteredTemperatureData.map((item) => ({
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

  return (
    <canvas
      ref={terrarium.ref}
      id={"myChart"}
      width="400"
      height="200"
    ></canvas>
  );
}

export default TemperatureChart;
