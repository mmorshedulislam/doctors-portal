import React, { useState } from "react";
import { useRef } from "react";
import { useContext } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthProvider";
import useToken from "../../hooks/useToken";

const Login = () => {
  const { signIn, googleSignIn, resetPassword } = useContext(AuthContext);

  const [pwEmail, setPwEmail] = useState("");
  const [loginError, setLoginError] = useState("");
  const location = useLocation();
  const [userEmail, setUserEmail] = useState("");
  const [token] = useToken(userEmail);
  const navigate = useNavigate();

  const from = location?.state?.from?.pathname || "/";

  if (token) {
    navigate(from, { replace: true });
  }

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm();

  const handleLogin = (data) => {
    setLoginError("");
    signIn(data.email, data.password)
      .then((result) => {
        const user = result.user;
        setUserEmail(data.email);
        toast.success("User Login successfully");
        console.log("login", userEmail);
      })
      .catch((err) => {
        setLoginError(err.message || err.code);
      });
  };

  const handleGoogleSignIn = () => {
    googleSignIn()
      .then(() => {
        navigate(from, { replace: true });
        toast.success("Successfully login with Google");
      })
      .catch((err) => console.log(err));
  };

  const handleResetPassword = () => {
    resetPassword(pwEmail)
      .then(() => {
        toast.success("Reset email has been sent.");
      })
      .catch((err) => {
        toast.error(err.message);
      });
  };

  console.log('token', token);

  return (
    <div className="h-[800px] flex justify-center items-center">
      <div className="w-96">
        <h2 className="text-2xl text-center">Login</h2>
        <form onSubmit={handleSubmit(handleLogin)}>
          <div className="form-control w-full">
            <label className="label">
              <span className="label-text">Email</span>
            </label>
            <input
              type="email"
              {...register("email", { required: "Email is required" })}
              placeholder="Email"
              className="input input-bordered w-full"
              onBlur={(event) => setPwEmail(event.target.value)}
            />
            {errors.email && (
              <p className="text-red-500">{errors.email?.message}</p>
            )}
          </div>
          <div className="form-control w-full">
            <label className="label">
              <span className="label-text">Password</span>
            </label>
            <input
              type="password"
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters.",
                },
              })}
              placeholder="Password"
              className="input input-bordered w-full"
            />
            {errors.password && (
              <p className="text-red-500">{errors.password?.message}</p>
            )}
          </div>
          {<p className="text-red-500">{loginError}</p>}
          <input
            className="btn btn-accent w-full my-4"
            type="submit"
            value="Login"
          />
        </form>
        <label className="label text">
          <button
            onClick={handleResetPassword}
            className="text-xl"
          >
            Forgot Password?
          </button>
        </label>
        <p className="text-center">
          New to Doctors Portal?{" "}
          <Link className="text-secondary" to="/signup">
            Create new Account?
          </Link>
        </p>
        <p className="divider">OR</p>
        <button onClick={handleGoogleSignIn} className="btn btn-outline w-full">
          CONTINUE WITH GOOGLE
        </button>
      </div>
    </div>
  );
};

export default Login;
