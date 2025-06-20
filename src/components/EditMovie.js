import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import "../styles/EditMovie.css";

function EditMovie() {
  const { movieId } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState({
    title: "",
    genre: [],
    release_year: "",
    duration: "",
    status: "",
    description: "",
    image_url: "",
    background_url: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [allGenres, setAllGenres] = useState([]);

useEffect(() => {
  axios.get("http://localhost:3001/api/categories")
    .then((res) => {
      const names = res.data.map((item) => item.category_name);
      setAllGenres(names);
    })
    .catch((err) => console.error("Lỗi lấy danh mục:", err));
}, []);

  // Lấy thông tin phim
  useEffect(() => {
    axios
      .get(`http://localhost:3001/api/movies/${movieId}/edit`)
      .then((res) => {
        const data = res.data;
        console.log("Dữ liệu API trả về:", data); // In ra để kiểm tra
        const genres = typeof data.genre === "string"
  ? data.genre.split(",").map(g => g.trim())
  : Array.isArray(data.genre)
    ? data.genre
    : [];

        setMovie({
          title: data.title || "",
          genre: genres,
          release_year: data.release_year?.toString() || "",
          duration: data.duration?.toString() || "",
          status: data.status || "",
          description: data.description || "",
          image_url: data.image_url || "",
          background_url: data.background_url || "",
        });
        setLoading(false);
      })
      .catch((err) => {
        console.error("Lỗi lấy dữ liệu:", err);
        setError("Đã xảy ra lỗi khi tải thông tin phim.");
        setLoading(false);
      });
  }, [movieId]);
  // Xử lý thay đổi
  const handleChange = (e) => {
    setMovie({ ...movie, [e.target.name]: e.target.value });
  };

  const handleUploadImage = async (e, fieldName) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "my_preset"); // thay bằng preset của bạn
    formData.append("cloud_name", "dq2kgi5oo"); // thay bằng cloud_name của bạn

    try {
      const res = await axios.post(
        `https://api.cloudinary.com/v1_1/dq2kgi5oo/image/upload`,
        formData
      );
      const imageUrl = res.data.secure_url;
      setMovie((prev) => ({ ...prev, [fieldName]: imageUrl }));
      alert("Tải ảnh thành công!");
    } catch (err) {
      console.error("Lỗi upload ảnh:", err);
      alert("Tải ảnh thất bại. Vui lòng thử lại.");
    }
  };

  // Cập nhật thông tin phim
  const handleSubmit = (e) => {
    e.preventDefault();

    const movieToSend = {
    ...movie,
    genre: movie.genre.join(",")  // 🔥 Chuyển mảng genre thành chuỗi
  };


    axios
      .put(`http://localhost:3001/api/movies/${movieId}`, movieToSend)
      .then(() => {
        alert("Cập nhật thành công!");
        navigate(-1);
      })
      .catch((err) => {
        console.error("Lỗi cập nhật:", err);
        setError("Đã xảy ra lỗi khi cập nhật thông tin phim.");
      });
  };

  if (loading) {
    return <div>Đang tải thông tin phim...</div>;
  }
  if (error) {
    return <div>Lỗi: {error}</div>;
  }

  return (
    <div className="edit-movie-container">
      <h2>Sửa Thông Tin Phim</h2>
      <form onSubmit={handleSubmit} className="edit-movie-form">
        <div className="left-section">
          <div className="image">
            <img
              src={movie.image_url || "/placeholder.jpg"}
              alt={movie.title}
              onError={(e) => {
                e.target.src = "/placeholder.jpg";
              }}
            />
          </div>
          <div className="button-container">
            <button type="submit" className="save-button">
              Lưu thay đổi
            </button>
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="cancel-button"
            >
              Hủy
            </button>
            {/* <button type="button" onClick={()=> navigate(`/admin/add/${movieId}/episode`)} className='add-episode-button'>Thêm tập phim</button> */}
          </div>
        </div>
        {/* Các trường input như trước */}
        <div className="form-groups">
          <div className="form-movie">
            <label htmlFor="title">Tên phim:</label>
            <input
              type="text"
              id="title"
              name="title"
              value={movie.title}
              onChange={handleChange}
              required
            />
          </div>
<div className="form-movie">
  <label>Thể loại:</label>
  <div className="genre-suggestions">
    {allGenres.map((genreName) => (
      <button
        type="button"
        key={genreName}
        className={`genre-button ${movie.genre.includes(genreName) ? "selected" : ""}`}
        onClick={() => {
          const alreadySelected = movie.genre.includes(genreName);
          const newGenres = alreadySelected
            ? movie.genre.filter((g) => g !== genreName)
            : [...movie.genre, genreName];
          setMovie({ ...movie, genre: newGenres });
        }}
      >
        {genreName}
      </button>
    ))}
  </div>
  <div className="selected-genres">
    {movie.genre.map((g) => (
      <span key={g} className="selected-tag">{g}</span>
    ))}
  </div>
</div>
          <div className="form-movie">
            <label htmlFor="release_year">Năm phát hành:</label>
            <input
              type="number"
              id="release_year"
              name="release_year"
              value={movie.release_year}
              min="0"
              onChange={handleChange}
            />
          </div>
          <div className="form-movie">
            <label htmlFor="duration">Thời lượng (Phút):</label>
            <input
              type="number"
              id="duration"
              name="duration"
              value={movie.duration}
              min="0"
              onChange={handleChange}
            />
          </div>
          <div className="form-movie">
            <label htmlFor="description">Mô tả:</label>
            <input
              type="text"
              id="description"
              name="description"
              value={movie.description}
              onChange={handleChange}
            />
          </div>
          <div className="form-movie">
            <label htmlFor="status">Trạng thái:</label>
            <input
              type="text"
              name="stauts"
              id="status"
              value={movie.status}
              disabled
            />
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
        </div>
      </form>
    </div>
  );
}

export default EditMovie;
