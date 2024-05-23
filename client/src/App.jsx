import { useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const apiCall = async () => {
    try {
      const response = await axios.get("http://localhost:3000");
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return (
    <>
      <h1>First client-server interaction</h1>
      <button onClick={apiCall}>Make Call</button>
    </>
  );
}

export default App;
