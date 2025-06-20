import axios from "axios";
import "../styles/AddMovie.css";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function AddMovie() {
  const [formData, setFormData] = useState({
    title: "",
    genre: "",
    release_year: "",
    duration: "",
    description: "",
    image_url: "",
    background_url: "",
    status: "Pending",
  });

  const navigate = useNavigate();
  // Hàm xử lý thay đổi giá trị của input
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData({ ...formData, [name]: value });
  };

  const handleUploadImage = async (e, fieldName) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "my_preset"); // Replace below
    formData.append("cloud_name", "dq2kgi5oo");

    try {
      const res = await axios.post(
        `https://api.cloudinary.com/v1_1/dq2kgi5oo/image/upload`,
        formData
      );
      const imageUrl = res.data.secure_url;
      setFormData((prev) => ({ ...prev, [fieldName]: imageUrl }));
      alert("Tải ảnh thành công!");
    } catch (err) {
      console.error("Lỗi upload ảnh:", err);
      alert("Tải ảnh thất bại. Vui lòng thử lại.");
    }
  };

  // Hàm xử lý khi form được submit
  const handleSubmit = (e) => {
    e.preventDefault();

    // Chuẩn bị dữ liệu gửi đi
    const dataToSend = {
      title: formData.title,
      description: formData.description,
      release_year: parseInt(formData.release_year, 10),
      duration: parseInt(formData.duration, 10),
      genre: formData.genre,
      image_url: formData.image_url,
      background_url: formData.background_url,
      status: formData.status,
    };
    if (
      !dataToSend.title ||
      !dataToSend.description ||
      !dataToSend.release_year ||
      !dataToSend.duration ||
      !dataToSend.genre ||
      !dataToSend.image_url ||
      !dataToSend.background_url
    ) {
      alert("Vui lòng điền đầy đủ các thông tin bắt buộc!");
      return; // Dừng hàm nếu validation thất bại
    }
    // Kiểm tra year và duration có phải số không nếu bạn muốn
    if (isNaN(dataToSend.release_year) || isNaN(dataToSend.duration)) {
      alert("Năm phát hành và Thời lượng phải là số!");
      return;
    }
    // >>> Gửi request POST lên API backend sử dụng .then().catch() <<<
    axios
      .post("http://localhost:3001/api/movies/add", dataToSend)
      .then((response) => {
        // Xử lý kết quả thành công ở đây
        if (response.status === 201) {
          alert("Thêm phim thành công!");
          navigate("/admin/manage-movie"); // Điều hướng về trang danh sách admin
        } else {
          // Xử lý các mã trạng thái thành công khác
          alert("Thêm phim thành công (API trả về trạng thái khác 201)!");
          navigate("/admin/manage-movie");
        }
      })
      .catch((error) => {
        // Xử lý lỗi ở đây
        console.error("Lỗi khi thêm phim:", error);
        // Hiển thị thông báo lỗi từ server nếu có
        if (
          error.response &&
          error.response.data &&
          error.response.data.error
        ) {
          alert(`Thêm phim thất bại: ${error.response.data.error}`);
        } else {
          alert("Thêm phim thất bại. Vui lòng thử lại.");
        }
      });
  };
  return (
    <div className="add-movie-container">
      <h2>Thêm Thông Tin Phim</h2>
      {/* Thêm onSubmit handler vào form */}
      <form className="add-movie-form" onSubmit={handleSubmit}>
        <div className="form-movie">
          <label>Tên phim:</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-movie">
          <label>Thể loại:</label>
          <input
            type="text"
            id="genre"
            name="genre"
            value={formData.genre}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-movie">
          <label>Năm phát hành:</label>
          <input
            type="number"
            id="release_year"
            name="release_year"
            value={formData.release_year}
            onChange={handleInputChange}
            min="0"
            required
          />
        </div>
        <div className="form-movie">
          <label>Thời lượng (phút):</label>
          <input
            type="number"
            id="duration"
            name="duration"
            value={formData.duration}
            onChange={handleInputChange}
            min="0"
            required
          />
        </div>
        <div className="form-movie">
          <label>Mô tả:</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            rows="4"
            required
          ></textarea>
        </div>
        <div className="form-movie">
          <label>Chọn Poster từ máy:</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleUploadImage(e, "image_url")}
          />
        </div>

        <div className="form-movie">
          <label>Chọn Background từ máy:</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleUploadImage(e, "background_url")}
          />
        </div>
        <div className="button-container">
          <button type="submit" className="submit-button">
            Thêm Phim
          </button>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="cancel-button"
          >
            Hủy
          </button>
        </div>
      </form>
    </div>
  );
}
export default AddMovie;
