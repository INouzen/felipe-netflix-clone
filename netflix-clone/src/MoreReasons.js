import React from "react";
import "./MoreReasons.css";

function MoreReasons() {
  const reasons = [
    {
      title: "Enjoy on your TV",
      desc: "Watch on Smart TVs, Playstation, Xbox, Chromecast, Apple TV, Blu-ray players, and more.",
      icon: "📺"
    },
    {
      title: "Download your shows to watch offline",
      desc: "Save your favorites easily and always have something to watch.",
      icon: "📥"
    },
    {
      title: "Watch everywhere",
      desc: "Stream unlimited movies and TV shows on your phone, tablet, laptop, and TV.",
      icon: "📱"
    },
    {
      title: "Create profiles for kids",
      desc: "Send kids on adventures with their favorite characters in a space made just for them.",
      icon: "👶"
    }
  ];

  return (
    <div className="reasons">
      <h2 className="reasons__title">More Reasons to Join</h2>
      <div className="reasons__grid">
        {reasons.map((reason, index) => (
          <div key={index} className="reasons__card">
            <h3>{reason.title}</h3>
            <p>{reason.desc}</p>
            <div className="reasons__icon">{reason.icon}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MoreReasons;