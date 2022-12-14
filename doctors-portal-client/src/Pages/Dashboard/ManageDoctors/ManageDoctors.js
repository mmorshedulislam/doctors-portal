import { useQuery } from "@tanstack/react-query";
import React from "react";
import { useState } from "react";
import toast from "react-hot-toast";
import ConfirmationModal from "../../Shared/ConfirmationModal/ConfirmationModal";
import Loading from "../../Shared/Loading";

const ManageDoctors = () => {
  const [deletingDoctor, setDeletingDoctor] = useState(null);
  const closeModal = () => {
    setDeletingDoctor(null);
  };
  const {
    data: doctors,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["doctors"],
    queryFn: async () => {
      try {
        const res = await fetch(`${process.env.REACT_APP_PORT}/doctors`, {
          headers: {
            authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        });
        const data = await res.json();
        return data;
      } catch (error) {}
    },
  });

  const handleDeleteDoctor = (doctor) => {
    fetch(`${process.env.REACT_APP_PORT}/doctors/${doctor._id}`, {
      method: "DELETE",
      headers: {
        authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.deletedCount > 0) {
          toast.success(`Doctor ${doctor.name} deleted successfully`);
          refetch();
        }
      });
  };

  if (isLoading) {
    return <Loading></Loading>;
  }
  return (
    <div>
      <h2 className="text-3xl mb-5 mx-5">Manage Doctors: {doctors?.length}</h2>
      <div className="overflow-x-auto">
        <table className="table w-full mx-5">
          <thead>
            <tr>
              <th></th>
              <th>Avatar</th>
              <th>Name</th>
              <th>Email</th>
              <th>Specialty</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {doctors.length &&
              doctors?.map((doctor, i) => (
                <tr key={doctor._id}>
                  <th>{i + 1}</th>
                  <th>
                    <div className="avatar">
                      <div className="w-16 rounded-full">
                        <img src={doctor.image} alt={doctor.name} />
                      </div>
                    </div>
                  </th>
                  <td>{doctor.name}</td>
                  <td>{doctor.email}</td>
                  <td>{doctor.specialty}</td>
                  <td>
                    <label
                      onClick={() => setDeletingDoctor(doctor)}
                      htmlFor="confirmation-modal"
                      className="btn btn-xs btn-error"
                    >
                      Delete
                    </label>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
      {deletingDoctor && (
        <ConfirmationModal
          title="Are you sure want to delete the Doctor?"
          message={`If you delete ${deletingDoctor?.name}. you cannot be return.`}
          successAction={handleDeleteDoctor}
          modalData={deletingDoctor}
          successDeleteButton="Delete"
          closeModal={closeModal}
        ></ConfirmationModal>
      )}
    </div>
  );
};

export default ManageDoctors;
