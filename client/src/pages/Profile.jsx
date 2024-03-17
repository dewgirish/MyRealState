import { useRef, useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";

import {
  updateUserInfoStart,
  updateUserInfoSuccess,
  updateUserInfoFail,
  deleteUserStart,
  deleteUserSuccess,
  deleteUserFail,
  signOutUserStart,
  signOutUsersuccess,
  signOutUserFail,
} from "../redux/user/userslice";
import { set } from "mongoose";

export default function Profile() {
  const { currentuser, loading, error } = useSelector((state) => state.user);

  const dispatch = useDispatch();
  const fileRef = useRef(null);
  const navigate = useNavigate();

  const [formData, setFormData] = useState(currentuser);
  const [file, setFile] = useState(null);
  const [filePercent, setFilePercent] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [listingError, setListingError] = useState(null);
  const [listing, setListing] = useState([]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      dispatch(updateUserInfoStart());
      const res = await fetch(`/api/user/update/${currentuser._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.success === false) {
        dispatch(updateUserInfoFail(data.message));
        setUpdateSuccess(false);
      } else {
        dispatch(updateUserInfoSuccess(data));
        setUpdateSuccess(true);
      }
    } catch (error) {
      console.log(error);
      setUpdateSuccess(false);
      dispatch(updateUserInfoFail(error.message));
    }
  };

  const deleteUserHandler = async () => {
    dispatch(deleteUserStart());
    try {
      const res = await fetch(`/api/user/delete/${currentuser._id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (data.success === false) {
        dispatch(deleteUserFail(data.message));
        setUpdateSuccess(false);
      } else {
        dispatch(deleteUserSuccess());
        setUpdateSuccess(true);
      }
    } catch (error) {
      console.log(error);
      dispatch(deleteUserFail(error.message));
      setUpdateSuccess(false);
    }
  };

  const singoutUserHandler = async () => {
    dispatch(signOutUserStart());
    try {
      const res = await fetch(`/api/auth/signout`, {
        method: "GET",
      });

      const data = await res.json();

      if (data.success === false) {
        dispatch(signOutUserFail(data.message));
        setUpdateSuccess(false);
      } else {
        dispatch(signOutUsersuccess());
        setUpdateSuccess(true);
      }
    } catch (error) {
      console.log(error);
      dispatch(signOutUserFail(error.message));
    }
  };

  const handelFileUpload = async (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + "_" + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

        setFilePercent(Math.round(progress));
        console.log(filePercent);
      },
      (error) => {
        setFileUploadError(true);
        console.log(error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setFormData({
            ...formData,
            avatar: downloadURL,
          });
          console.log("File available at", downloadURL);
        });
      }
    );
  };

  useEffect(() => {
    if (file) {
      handelFileUpload(file);
    }
  }, [file]);

  const showListingHandler = async () => {
    setListingError(null);
    try {
      const res = await fetch(`/api/listing/get/`, {
        method: "GET",
      });

      const data = await res.json();

      if (data.success === false) {
        setListingError(data.message);
        return;
      } else {
        setListing(data);
      }
    } catch (error) {
      console.log(error);
      setListingError(error.message);
    }
  };

  const deleteListingHandler = async (id) => {
    console.log("deleteListingHandler" + id);
    try {
      const res = await fetch(`/api/listing/delete/${id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (data.success === false) {
        setListingError(data.message);
        return;
      }

      setListing((prev) => prev.filter((item) => item._id !== id));
    } catch (error) {
      console.log(error);
      setListingError(error.message);
    }
  };
  // const editListingHandler = async (id) => {
  //   navigate(`/edit-listing/${id}`);
  // };

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl text-center font-semibold my-7">Profile</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          onChange={(e) => setFile(e.target.files[0])}
          type="file"
          ref={fileRef}
          accept="image/*"
          hidden
        />
        <img
          onClick={() => fileRef.current.click()}
          src={formData.avatar}
          alt="avatar"
          className="rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2"
        />

        {fileUploadError && (
          <p className="text-center text-sm text-red-500">
            File Upload Error, Max file size 2MB.
          </p>
        )}
        {filePercent > 0 && filePercent != 100 && (
          <p className="text-center text-sm text-yellow-500">
            {filePercent + "%"}
          </p>
        )}
        {filePercent == 100 && (
          <p className="text-center text-sm text-green-500">
            File Uploaded Successfully
          </p>
        )}

        <input
          type="text"
          placeholder="username"
          className="border p-3 rounded-lg"
          id="username"
          onChange={handleChange}
          value={formData.username}
        />
        <input
          type="email"
          placeholder="email"
          className="border p-3 rounded-lg "
          id="email"
          onChange={handleChange}
          value={formData.email}
        />

        <input
          type="password"
          placeholder="password"
          className="border p-3 rounded-lg "
          id="password"
          onChange={handleChange}
        />
        <button className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-90 disabled:opacity-80">
          Update Profile
        </button>
        <Link
          to="/create-listing"
          className="bg-green-700 text-white p-3 rounded-lg uppercase hover:opacity-90 disabled:opacity-80 text-center"
        >
          Create Listing
        </Link>
      </form>
      <div className="flex justify-between mt-5">
        <span
          onClick={deleteUserHandler}
          className="text-blue-500 cursor-pointer"
        >
          Delete Account
        </span>
        <span
          onClick={singoutUserHandler}
          className="text-blue-500 cursor-pointer"
        >
          Sing out
        </span>
      </div>
      <p className="text-red-700 mt-5">
        {!updateSuccess && error ? error : ""}
      </p>
      <p className="text-green-700 mt-5">
        {updateSuccess ? "User is updated successfully!" : ""}
      </p>

      <button
        type="button"
        onClick={showListingHandler}
        className="text-green-700 w-full uppercase"
      >
        Show Listing
      </button>
      <p className="text-red-700 text-sm text-center">
        {listingError && listingError}
      </p>

      {listing.length > 0 && (
        <div className="flex flex-col gap-4">
          <h1 className="text-2xl text-center font-semibold mt-7">
            Your Listings
          </h1>
          {listingError && (
            <p className="text-red-700 text-sm text-center">{listingError}</p>
          )}
          {listing.map((item) => (
            <div
              className="border rounded-lg p-3 gap-4 flex items-center justify-between object-center"
              key={item._id}
            >
              <Link>
                <img
                  className="h-16 w-16 object-contain"
                  src={item.imageUrls}
                  alt={item.name}
                />
              </Link>
              <Link
                className="flex-1 text-slate-700 font-semibold hover:underline truncate"
                to={`/listing/${item._id}`}
              >
                <p>{item.name}</p>
              </Link>
              <div className="flex flex-col items-center">
                <Link to={`/edit-listing/${item._id}`}>
                  <button type="button" className="text-green-700">
                    Edit
                  </button>
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    deleteListingHandler(item._id);
                  }}
                  className="text-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
