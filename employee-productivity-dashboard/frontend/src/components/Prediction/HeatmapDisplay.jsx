import React, { useState, useEffect } from "react";
import axios from "axios";

const HeatmapDisplay = ({ index }) => {
  const [heatmapUrl, setHeatmapUrl] = useState("");

  useEffect(() => {
    const fetchHeatmap = async () => {
      try {
        const response = await axios.get(
          `http://127.0.0.1:5000/heatmap?index=${index}`,
          { responseType: "blob" }
        );
        setHeatmapUrl(URL.createObjectURL(response.data));
      } catch (error) {
        console.error("Error fetching heatmap:", error);
      }
    };
    fetchHeatmap();
  }, [index]);

  return (
    <div>
      <h2>Resignation Risk Heatmap</h2>
      {heatmapUrl ? (
        <img
          src={heatmapUrl}
          alt="Employee Resignation Risk Heatmap"
          style={{ width: "100%" }}
        />
      ) : (
        <p>Loading heatmap...</p>
      )}
    </div>
  );
};

export default HeatmapDisplay;
