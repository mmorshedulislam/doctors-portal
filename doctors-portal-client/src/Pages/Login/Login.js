import React, { useState } from "react";
import { useRef } from "react";
import { useContext } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthProvider";

const Login = () => {
  const { signIn, googleSignIn, resetPassword } = useContext(AuthContext);
  const [loginError, setLoginError] = useState("");
  const location = useLocation();
  const navigate = useNavigate();
  const from = location?.state?.from?.pathname || "/";
  const emailRef = useRef();
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm();

  const handleLogin = (data) => {
    console.log(data);
    setLoginError("");
    signIn(data.email, data.password)
      .then((result) => {
        const user = result.user;
        navigate(from, { replace: true });
        toast.success("User Login successfully");
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
    const email = emailRef.current.value;
    resetPassword(email)
      .then(() => {
        toast.success("Reset email has been sent.");
      })
      .catch((err) => {
        toast.error(err.message);
      });
  };

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
              {...register("email", )}
              // { required: "Email is required" }
              placeholder="Email"
              className="input input-bordered w-full"
              ref={emailRef}
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
            <label className="label text-xl">
              <button
                onClick={handleResetPassword}
                className="label-text-alt text-xl"
              >
                Forgot Password?
              </button>
            </label>
          </div>
          {<p>{loginError}</p>}
          <input
            className="btn btn-accent w-full my-4"
            type="submit"
            value="Login"
          />
        </form>
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
