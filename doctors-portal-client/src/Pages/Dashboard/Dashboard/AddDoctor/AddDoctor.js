import { useQuery } from "@tanstack/react-query";
import React from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import Loading from "../../../Shared/Loading";

const AddDoctor = () => {
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm();

  const imgbbHostKey = process.env.REACT_APP_imgBB_key;

    const navigate = useNavigate()

  const { data: specialties, isLoading } = useQuery({
    queryKey: ["specialty"],
    queryFn: async () => {
      const res = await fetch(`http://localhost:5000/appointmentSpecialty`);
      const data = res.json();
      return data;
    },
  });

  const handleAddDoctor = (data) => {
    const image = data.image[0];
    const formData = new FormData();
    formData.append("image", image);
    const url = `https://api.imgbb.com/1/upload?key=${imgbbHostKey}`;
    fetch(url, {
      method: "POST",
      body: formData,
    })
      .then((res) => res.json())
      .then((imgData) => {
        if (imgData.success) {
          const imgUrl = imgData.data.url;
          
          // save doctor information to the database
          const doctor = {
            name: data.name,
            email: data.email,
            specialty: data.specialty,
            image: imgUrl,
          };
          fetch("http://localhost:5000/doctors", {
            method: "POST",
            headers: {
              "content-type": "application/json",
              authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
            body: JSON.stringify(doctor),
          })
            .then((res) => res.json())
            .then((result) => {
              console.log(result);
             toast.success(`${data.name} is added successfully.`)
             navigate('/dashboard/managedoctors')
            });
        }
      });
  };

  if (isLoading) {
    return <Loading></Loading>;
  }

  return (
    <div className="w-96 p-7">
      <h2 className="text-3xl">Add A Doctor</h2>
      <form onSubmit={handleSubmit(handleAddDoctor)}>
        <div className="form-control w-full">
          <label className="label">
            <span className="label-text">Name</span>
          </label>
          <input
            {...register("name", {
              required: "Name is Required.",
            })}
            type="text"
            placeholder="Name"
            className="input input-bordered w-full"
          />
          {errors.name && (
            <p className="text-red-400">{errors.name?.message}</p>
          )}
        </div>
        <div className="form-control w-full">
          <label className="label">
            <span className="label-text">Email</span>
          </label>
          <input
            {...register("email", {
              required: "Email is required",
            })}
            type="email"
            placeholder="Email"
            className="input input-bordered w-full"
          />
          {errors.email && (
            <p className="text-red-400">{errors.email?.message}</p>
          )}
        </div>
        <div className="form-control w-full">
          <label className="label">
            <span className="label-text">Specialty</span>
          </label>
          <select
            {...register("specialty")}
            className="select select-bordered w-full"
          >
            {specialties.map((specialty) => (
              <option key={specialty._id} value={specialty?.name}>
                {specialty?.name}
              </option>
            ))}
          </select>
        </div>
        <div className="form-control w-full">
          <label className="label">
            <span className="label-text">Photo</span>
          </label>
          <input
            {...register("image", {
              required: "Photo is Required.",
            })}
            type="file"
            className="input input-bordered w-full"
          />
          {errors.img && <p className="text-red-400">{errors.img?.message}</p>}
        </div>
        <input
          className="btn btn-accent w-full my-4"
          type="submit"
          value="Add Doctor"
        />
      </form>
    </div>
  );
};

export default AddDoctor;

/**
 * Three places to store images
 * 1. Third party image hosting server
 * 2. File system of your own server
 * 3. mongodb (database)
 */
