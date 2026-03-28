import { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function Login() {

  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      const { data } = await API.post("/auth/login", form);

      localStorage.setItem("token", data.accessToken);

      localStorage.setItem("user", JSON.stringify(data.user));

      window.dispatchEvent(new Event("userChanged"));

      if (data.user.role === "admin") {
        navigate("/admin-dashboard");
      } else if (data.user.role === "vendor") {
        navigate("/vendor-dashboard");
      } else {
        navigate("/");
      }

    } catch (error) {

      console.log(error);
      toast.error("Login failed. Please check your credentials and try again.");

    }

  };

  return (

    <div className="flex justify-center items-center min-h-screen">

      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-xl shadow w-96"
      >

        <h2 className="text-2xl font-bold mb-6">
          Login
        </h2>

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
          Login
        </button>

        <p className="mt-4 text-center">
          Don't have an account?{" "}
          <span
            onClick={() => navigate("/register")}
            className="text-orange-500 cursor-pointer"
          >
            Register
          </span>
        </p>

      </form>

    </div>

  );

}

export default Login;