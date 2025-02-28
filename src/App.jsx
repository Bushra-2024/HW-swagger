import { useEffect, useState } from "react";
import axios from "axios";
import { Card, Modal } from "@mui/material";
import "./App.css";
import DeleteIcon from "@mui/icons-material/Delete";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import BorderColorOutlinedIcon from "@mui/icons-material/BorderColorOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
const API = "https://to-dos-api.softclub.tj/api/to-dos";
const App = () => {
  const [data, setData] = useState([]);
  // ADD
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState([]);
  const [openAdd, setOpenAdd] = useState(false);
  // addimg
  const [imgOpenAdd, setImgOpenAdd] = useState(false);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [selectedID, setselectedID] = useState("");
  // edit
  const [openEdit, setOpenEdit] = useState(false);
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [currentId, setCurrentId] = useState(null);
  // getbyid
  const [dataId, setDataId] = useState({});
  const [openID, setOpenID] = useState(false);
  const GetData = async () => {
    try {
      const { data } = await axios.get(API);
      setData(data.data);
    } catch (error) {
      console.error(error);
    }
  };
  const getById = async (id) => {
    try {
      const { data } = await axios.get(`${API}/${id}`);
      setDataId(data.data);
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    GetData();
    getById(currentId);
  }, [currentId]);
  const FileChange = (e) => {
    const selectedFiles = e.target.files;
    setImages(selectedFiles);
    const previews = [];
    for (let i = 0; i < selectedFiles.length; i++) {
      const reader = new FileReader();
      reader.onloadend = () => {
        previews.push(reader.result);
        if (previews.length === selectedFiles.length) {
          setImagePreviews(previews);
        }
      };
      reader.readAsDataURL(selectedFiles[i]);
    }
  };
  //add
  const AddIt = async () => {
    const formatData = new FormData();
    formatData.append("name", name);
    formatData.append("description", description);
    for (let i = 0; i < images.length; i++) {
      formatData.append("images", images[i]);
    }
    try {
      await axios.post(API, formatData);
      GetData();
      setOpenAdd(false);
      setName("");
      setDescription("");
      setImages([]);
      setImagePreviews([]);
    } catch (error) {
      console.error(error);
    }
  };
  const Addpic = async () => {
    const formatData = new FormData();
    for (let i = 0; i < images.length; i++) {
      formatData.append("images", images[i]);
    }
    try {
      await axios.post(`${API}/${selectedID}/images`, formatData);
      GetData();
      setImgOpenAdd(false);
      setImagePreviews([]);
      setselectedID("");
    } catch (error) {
      console.error(error);
    }
  };
  // delete
  const DeleteIt = async (id) => {
    try {
      await fetch(`${API}?id=${id}`, {
        method: "DELETE",
      });
      GetData();
    } catch (error) {
      console.error(error);
    }
  };
  const DeletePic = async (id) => {
    try {
      await axios.delete(`${API}/images/${id}`);
      GetData();
    } catch (error) {
      console.error(error);
    }
  };
  // edit
  const editIt = async (e) => {
    e.preventDefault();
    try {
      await fetch("https://to-dos-api.softclub.tj/api/to-dos", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: currentId,
          name: editName,
          description: editDescription,
        }),
      });
      setOpenEdit(false);
      GetData();
    } catch (error) {
      console.error(error);
    }
  };
  const EditClick = (id, name, description) => {
    setCurrentId(id);
    setEditName(name);
    setEditDescription(description);
    setOpenEdit(true);
  };
  function handleClick() {
    if (localStorage.theme === "dark" || !("theme" in localStorage)) {
      //add class=dark in html element
      document.documentElement.classList.add("dark");
    } else {
      //remove class=dark in html element
      document.documentElement.classList.remove("dark");
    }

    if (localStorage.theme === "dark") {
      localStorage.theme = "light";
    } else {
      localStorage.theme = "dark";
    }
  }
  const CheckboxChange = async (id, isCompleted) => {
    try {
      await axios.put(
        `https://to-dos-api.softclub.tj/completed?id=${id}`,
        {
          isCompleted: !isCompleted,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      GetData();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="dark:bg-black bg-white">
      <h1 className="font-bold text-[33px] text-center py-5 text-green-950 dark:text-white">
        HomeWork
      </h1>
      <div className="flex gap-2 justify-center">
        <button
          onClick={() => setOpenAdd(true)}
          className="bg-green-900  hover:bg-green-700 text-[white] py-1 px-4 font-bold rounded-lg"
        >
          Add+
        </button>
        <button
          onClick={handleClick}
          className="bg-green-900 text-[white] py-1 px-4 font-bold rounded-lg"
        >
          Dark
        </button>
      </div>
      {/* Map */}
      <div className="flex flex-wrap p-10 gap-10 m-auto justify-center">
        {data.map((el) => (
          <Card
            key={el.id}
            className="w-[300px] dark:bg-amber-600  flex flex-col gap-5 p-5 border-1 border-green-800"
          >
            <div className="flex gap-3">
              {el.images.map((e) => (
                <div key={e.id} className="relative">
                  <img
                    src={`https://to-dos-api.softclub.tj/images/${e.imageName}`}
                    className={`h-[160px] object-cover ${
                      el.images.length > 1
                        ? "w-[150px]"
                        : "w-full object-contain"
                    }`}
                  />
                  <div className="absolute top-0 right-0">
                    <button onClick={() => DeletePic(e.id)}>
                      <DeleteIcon className="text-red-700" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <p className="font-bold ">{el.name}</p>
            <p className="font-semibold mt-[-15px]">{el.description}</p>
            <button
              className={`text-white px-2 py-1 rounded text-[12px] ml-auto 
                ${el.isCompleted ? "bg-green-900" : "bg-red-700"}`}
            >
              {el.isCompleted ? "Active" : "Inactive"}
            </button>
            <div className="flex justify-around">
              <button
                className="bg-green-900 p-[2px] text-white rounded-sm"
                onClick={() => {
                  setselectedID(el.id);
                  setImgOpenAdd(true);
                }}
              >
                Add Img
              </button>
              <button onClick={() => DeleteIt(el.id)}>
                {" "}
                <DeleteOutlinedIcon className="text-green-900 hover:text-green-600" />
              </button>
              <button onClick={() => EditClick(el.id, el.name, el.description)}>
                <BorderColorOutlinedIcon className="text-green-900 hover:text-green-600" />
              </button>
              <button
                onClick={() => {
                  setCurrentId(el.id);
                  setOpenID(true);
                }}
              >
                {" "}
                <VisibilityOutlinedIcon className="text-green-900 hover:text-green-600" />
              </button>
              <input
                type="checkbox"
                className="w-[15px] h-[22px] text-green-900 accent-green-900 cursor-pointer"
                checked={el.isCompleted}
                onChange={() => CheckboxChange(el.id, el.isCompleted)}
              />
            </div>
          </Card>
        ))}
      </div>
      {/* Add */}
      <Modal open={openAdd} onClose={() => setOpenAdd(false)}>
        <div className="bg-white fixed top-0 right-0 left-0 bottom-0 m-auto w-[500px] h-[450px] flex justify-center items-start text-black flex-col gap-2 p-10 rounded-2xl border-2 border-green-900">
          <p className="font-bold text-xl">Add</p>
          <input
            placeholder="type name here"
            className="border border-green-950 rounded-sm px-2 py-2"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            placeholder="type description here"
            className="border border-green-950  rounded-sm px-2 py-2"
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <input
            type="file"
            multiple
            className="border border-green-950 "
            onChange={FileChange}
          />
          <div className="flex gap-0.5 flex-wrap">
            {imagePreviews.map((pre, i) => (
              <div key={i}>
                <img key={pre.id} src={pre} width="100" />
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <button
              className="bg-green-900 hover:bg-green-700 rounded-sm text-white px-4 py-1 "
              onClick={AddIt}
            >
              Save
            </button>
            <button
              className="bg-green-900 hover:bg-green-700 rounded-sm text-white px-4 py-1 "
              onClick={() => setOpenAdd(false)}
            >
              Close
            </button>
          </div>
        </div>
      </Modal>
      {/* edit */}
      <Modal open={openEdit} onClose={() => setOpenEdit(false)}>
        <div className="bg-white fixed top-0 right-0 left-0 bottom-0 m-auto w-[500px] h-[450px] flex justify-center items-start text-black flex-col gap-2 p-10 rounded-2xl border-2 border-green-900">
          <p className="font-bold text-xl">Add</p>
          <input
            placeholder="type name here"
            className="border border-green-950 rounded-sm px-2 py-2"
            type="text"
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
          />
          <input
            placeholder="type description here"
            className="border border-green-950  rounded-sm px-2 py-2"
            type="text"
            value={editDescription}
            onChange={(e) => setEditDescription(e.target.value)}
          />
          <div className="flex gap-2">
            <button
              className="bg-green-900 hover:bg-green-700 rounded-sm text-white px-4 py-1 "
              onClick={editIt}
            >
              Save
            </button>
            <button
              className="bg-green-900 hover:bg-green-700 rounded-sm text-white px-4 py-1 "
              onClick={() => setOpenEdit(false)}
            >
              Close
            </button>
          </div>
        </div>
      </Modal>
      <Modal open={imgOpenAdd} onClose={() => setImgOpenAdd(false)}>
        <div className="bg-white fixed top-0 right-0 left-0 bottom-0 m-auto w-[500px] h-[450px] flex justify-center items-start text-black flex-col gap-2 p-10 rounded-2xl border-2 border-green-900">
          <p className="font-bold text-xl">Add Image</p>
          <input
            type="file"
            multiple
            className="border border-green-950 py-3 px-1 "
            onChange={FileChange}
          />
          <div className="flex gap-0.5 flex-wrap">
            {imagePreviews.map((pre) => (
              <img key={pre.id} src={pre} width="100" />
            ))}
          </div>
          <div className="flex gap-2">
            <button
              className="bg-green-900 hover:bg-green-700 rounded-sm text-white px-4 py-1 "
              onClick={Addpic}
            >
              Save
            </button>
            <button
              className="bg-green-900 hover:bg-green-700 rounded-sm text-white px-4 py-1 "
              onClick={() => setImgOpenAdd(false)}
            >
              Close
            </button>
          </div>
        </div>
      </Modal>
      {/* getbyid */}
      <Modal open={openID} onClose={() => setOpenID(false)}>
        <div className="bg-white fixed top-0 right-0 left-0 bottom-0 m-auto w-[500px] h-[450px] flex justify-center items-start text-black flex-col gap-2 p-10 rounded-2xl border-2 border-green-900">
          <p className="font-bold text-xl">Info</p>
          <p>
            <span className="font-semibold">Name:</span> {dataId.name}
          </p>
          <p>
            <span className="font-semibold">Description:</span>{" "}
            {dataId.description}
          </p>

          {dataId.images &&
            Array.isArray(dataId.images) &&
            dataId.images.map((e) => (
              <img
                key={e.id}
                src={"https://to-dos-api.softclub.tj/images/" + e.imageName}
                alt={e.imageName}
                className="w-[170px] h-[130px] object-cover"
              />
            ))}

          <div className="flex gap-2">
            <button
              className="bg-green-900 hover:bg-green-700 rounded-sm text-white px-4 py-1 "
              onClick={() => setOpenID(false)}
            >
              Close
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default App;
