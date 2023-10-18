import React, { useEffect, useState } from "react";
import api from "./API";

const App = () => {
  const [transactions, setTransactions] = useState([]);
  const [formData, setFormData] = useState({
    amount: 0,
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

  // handlng item delete:
  const handle_delete = async (id) => {
    await api.delete(`/transactions/${id}`);
    fetch_transactions();
  };

  return (
    <div>
      <nav className="navbar navbar-dark bg-primary">
        <div className="container-fluid">
          <p className="navbar-brand">Finance App</p>
        </div>
      </nav>

      <div className="container">
        <form action="" onSubmit={handle_form_submit}>
          <div className="mb-3 mt-3">
            <label htmlFor="amount" className="form-label">
              Amount
            </label>
            <input
              type="number"
              onChange={handle_input_change}
              value={formData.amount}
              className="form-control"
              id="amount"
              name="amount"
            />
          </div>

          <div className="mb-3">
            <label htmlFor="category" className="form-label">
              Category
            </label>
            <input
              type="text"
              onChange={handle_input_change}
              value={formData.category}
              className="form-control"
              id="category"
              name="category"
            />
          </div>

          <div className="mb-3">
            <label htmlFor="description" className="form-label">
              Description
            </label>
            <input
              type="text"
              onChange={handle_input_change}
              value={formData.description}
              className="form-control"
              id="description"
              name="description"
            />
          </div>

          <div className="mb-3">
            <label htmlFor="is_income" className="form-label">
              Icome Type
            </label>
            <input
              type="checkbox"
              onChange={handle_input_change}
              value={formData.is_income}
              id="is_income"
              name="is_income"
              style={{ marginLeft: "1rem", paddingTop: "10px" }}
            />
          </div>

          <div className="mb-3">
            <label htmlFor="date" className="form-label">
              Date
            </label>
            <input
              type="text"
              onChange={handle_input_change}
              value={formData.date}
              className="form-control"
              id="date"
              name="date"
            />
          </div>

          <button type="submit" className="btn btn-primary">
            Submit
          </button>
        </form>

        <table className="table table-striped table-bordered table-hover mt-5 mb-5">
          <thead>
            <tr>
              <th>Amount</th>
              <th>Category</th>
              <th>Description</th>
              <th>Income</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((item) => (
              <tr key={item.id}>
                <td>{item.amount}</td>
                <td>{item.category}</td>
                <td>{item.description}</td>
                <td>{item.is_income ? "Yes" : "No"}</td>
                <td>{item.date}</td>
                <td>
                  <button
                    className="btn btn-primary"
                    onClick={() => handle_delete(item.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default App;
