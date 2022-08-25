import React, { useState } from "react";
import { Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/navbar/navbar";
import { API } from "../components/config/api";
import { useMutation } from "react-query";
import pict from "../assets/pict.png";

export default function AddToping() {
  const [preview, setPreview] = useState(null);
  const [previewName, setPreviewName] = useState("");
  const [form, setform] = useState({
    image: "",
    title: "",
    price: "",
  });

  const handleChange = (e) => {
    setform({
      ...form,
      [e.target.name]:
        e.target.type === "file" ? e.target.files : e.target.value,
    });

    console.log(e.target.files);
    if (e.target.type === "file") {
      let url = URL.createObjectURL(e.target.files[0]);
      setPreview(url);
      setPreviewName(e.target.files[0].name);
    }
  };

  let navigate = useNavigate();

  const handleSubmit = useMutation(async (e) => {
    try {
      e.preventDefault();

      const config = {
        headers: {
          "Content-type": "multipart/form-data",
        },
      };

      const formData = new FormData();
      formData.set("image", form.image[0], form.image[0].name);
      formData.set("title", form.title);
      formData.set("price", form.price);

      // Insert category data
      const response = await API.post("/topping", formData, config);

      navigate("/transaction");
    } catch (error) {
    }
  });
  return (
    <>
      <Navbar />
      <Container className="addProduct">
        <div className="addProductLeft">
          <form onSubmit={(e) => handleSubmit.mutate(e)}>
            <h1>Toping</h1>
            <input
              type="text"
              placeholder="Name Toping"
              name="title"
              onChange={handleChange}
            />
            <input
              type="number"
              placeholder="Price"
              name="price"
              onChange={handleChange}
            />
            <input
              type="file"
              id="addProductImage"
              hidden
              name="image"
              onChange={handleChange}
            />
            <label
              htmlFor="addProductImage"
              className={previewName === "" ? "addProductImage" : "previewName"}
            >
              {previewName === "" ? "Photo Toping" : previewName}
              <img src={pict} alt="paperClip" />
            </label>
            <button>Add Toping</button>
          </form>
        </div>
        {preview && (
          <div className="addProductRight">
            <img src={preview} alt="preview" />
          </div>
        )}
      </Container>
    </>
  );
}
