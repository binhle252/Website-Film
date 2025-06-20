import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/AddEpisode.css';

function AddEpisode() {
    const { movieId } = useParams();
    const navigate = useNavigate();
    const [episode, setEpisode] = useState({
        episode_number: '',
        title: '',
        video_url: ''
    });
    const [error, setError] = useState('');
    const [existingEpisodes, setExistingEpisodes] = useState([]);

    // Lấy danh sách tập phim hiện có
    useEffect(() => {
        axios.get(`http://localhost:3001/api/movies/${movieId}/episodes`)
            .then(response => {
                setExistingEpisodes(response.data); // Lưu danh sách tập phim
            })
            .catch(err => {
                console.error('Lỗi khi lấy danh sách tập phim:', err);
                setError('Không thể tải danh sách tập phim.');
            });
    }, [movieId]);

    const handleChange = (e) => {
        setEpisode({ ...episode, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Kiểm tra rỗng và số tập âm
        if (!episode.episode_number || Number(episode.episode_number) <= 0 || !episode.title.trim() || !episode.video_url.trim()) {
            setError("Vui lòng nhập đầy đủ thông tin tập phim. Số tập phải lớn hơn 0.");
            return;
        }

        // Kiểm tra trùng lặp số tập
        if (existingEpisodes.some(ep => Number(ep.episode_number) === Number(episode.episode_number))) {
            setError("Số tập này đã tồn tại. Vui lòng chọn số tập khác.");
            return;
        }

        // Gửi yêu cầu thêm tập phim
axios.post(`http://localhost:3001/api/movies/${movieId}/episodes`, episode)
    .then(() => {
        alert('Thêm tập phim thành công!');
        return axios.get(`http://localhost:3001/api/movies/${movieId}/episodes`);
    })
    .then(response => {
        setExistingEpisodes(response.data); // Cập nhật danh sách mới
        navigate(`/admin/edit/${movieId}`);
    })
    .catch(err => {
        console.error('Lỗi khi thêm tập phim:', err);
        setError('Không thể thêm tập phim. Vui lòng thử lại.');
    });
    };

    return (
        <div className="add-episode-container">
            <h2>Thêm Tập Phim Cho Movie ID: {movieId}</h2>
            {error && <p className="error">{error}</p>}
            <form onSubmit={handleSubmit} className="add-episode-form">
                <div className="form-group">
                    <label>Số tập:</label>
                    <input
                        type="number"
                        name="episode_number"
                        value={episode.episode_number}
                        onChange={handleChange}
                        min="1"
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Tiêu đề tập phim:</label>
                    <input
                        type="text"
                        name="title"
                        value={episode.title}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>URL video:</label>
                    <input
                        type="text"
                        name="video_url"
                        value={episode.video_url}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="button-container">
                    <button type="submit" className="submit-button">Thêm Tập</button>
                    <button type="button" onClick={() => navigate(-1)} className="cancel-button">Hủy</button>
                </div>
            </form>
        </div>
    );
}

export default AddEpisode;