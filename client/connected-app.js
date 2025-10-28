// Fully connected classroom portal frontend
(() => {
  const API_URL = "http://localhost:3001/api";
  
  // API helper function
  async function apiCall(endpoint, options = {}) {
    const token = localStorage.getItem("token");
    const config = {
      headers: {
        "Content-Type": "application/json",
       