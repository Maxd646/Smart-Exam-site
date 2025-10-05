import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./RulesPage.css";

export default function OrientationPage() {
  const navigate = useNavigate();
  const [videoUrl, setVideoUrl] = useState("");

  useEffect(() => {
    const fetchOrientationVideo = async () => {
      try {
        const res = await fetch(
          "http://localhost:8000/authentication/exam_orientetions/"
        );
        const data = await res.json();
        if (data.length > 0 && data[0].media_url) {
          setVideoUrl(data[0].media_url);
        }
      } catch (err) {
        console.error("Failed to load orientation video", err);
      }
    };
    fetchOrientationVideo();
  }, []);

  const handleNext = () => {
    navigate("/start");
  };

  return (
    <div className="orientation-container">
      <h6 className="orientation-title">Exam Orientation</h6>
      {videoUrl ? (
        <video controls controlsList="nodownload" className="orientation-video">
          <source src={videoUrl} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      ) : (
        <p className="loading-text">Loading orientation video...</p>
      )}
      <p className="orientation-note">
        Please watch the entire orientation video before proceeding.
      </p>
      <button className="next-btn" onClick={handleNext}>
        Next ➡️
      </button>
    </div>
  );
}
