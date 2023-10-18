import React, { useEffect, useState } from "react";
import api from "./API";

const App = () => {
  const [transactions, setTransactions] = useState([]);
  const [formData, setFormData] = useState({
    amount: "",
    category: "",
    description: "",
    is_income: false,
    date: "",
  });

  // fetching transactions from Database:
  const fetch_transactions = async () => {
    const res = await api.get("/transactions/");
    setTransactions(res.data);
  };

  // fetching transactions on initial load:
  useEffect(() => {
    fetch_transactions();
  }, []);

  // handling any input changes:
  const handle_input_change = (e) => {
    const val =
      e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setFormData({
      ...formData,
      [e.target.name]: val,
    });
  };

  // handling form submit event and saving data to Database:
  const handle_form_submit = async (e) => {
    e.preventDefault();
    await api.post("/transactions/", formData);
    fetch_transactions();
    setFormData({
      amount: "",
      category: "",
      description: "",
      is_income: false,
      date: "",
    });
  };

  return (
    <div>
      <nav className="navbar navbar-dark bg-primary">
        <div className="container-fluid">
          <a className="navbar-brand" href="#">
            Finance App
          </a>
        </div>
      </nav>
    </div>
  );
};

export default App;
