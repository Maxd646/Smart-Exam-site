import React from "react";
import { Link } from "react-router-dom";

export const NotFound = () => {
  return (
    <div
      style={{
        height: "100vh",
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "hsla(195, 72%, 93%, 1.00)",
      }}
    >
      <div
        style={{
          textAlign: "center",
          color: "#120a0aff",
          padding: "20px",
          borderRadius: "5px",
        }}
      >
        <h1
          style={{
            fontSize: "2rem",
            fontWeight: "bold",
          }}
        >
          404 Not Found
        </h1>
        <p>The page you are looking for does not exist.</p>
        <p>Please check the URL or return to the homepage.</p>
        <Link
          to="/"
          style={{
            textDecoration: "none",
            color: "#061a41ff",
            fontWeight: "bold",
            backgroundColor: "transparent",
            padding: "10px 20px",
            border: "2px solid #061a41ff",
            borderRadius: "5px",
            transition: "background-color 0.3s, color 0.3s",
            display: "inline-block",
            marginTop: "40px",
            ":hover": {
              backgroundColor: "#061a41ff",
              color: "#ffffff",
            },
          }}
        >
          Go to Homepage
        </Link>
      </div>
    </div>
  );
};
