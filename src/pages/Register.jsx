import { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function Register() {

  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: ""
  });

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      await API.post("/auth/register", form);

      navigate("/login");

      toast.success("Account created successfully");

    } catch (error) {

      console.log(error);
      toast.error("Registration failed. Please try again.");

    }

  };

  return (

    <div className="flex justify-center items-center min-h-screen">

      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-xl shadow w-96"
      >

        <h2 className="text-2xl font-bold mb-6">
          Create Account
        </h2>

        <input
          placeholder="Name"
          className="border p-2 w-full mb-4 rounded"
          onChange={e => setForm({ ...form, name: e.target.value })}
        />

        <input
          placeholder="Email"
          className="border p-2 w-full mb-4 rounded"
          onChange={e => setForm({ ...form, email: e.target.value })}
        />

        <input
          type="password"
          placeholder="Password"
          className="border p-2 w-full mb-4 rounded"
          onChange={e => setForm({ ...form, password: e.target.value })}
        />

        <button className="bg-orange-500 w-full text-white py-2 rounded">
          Register
        </button>

      </form>

    </div>

  );

}

export default Register;