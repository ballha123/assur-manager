"use client";

import React, { useState, useEffect, useRef } from "react";

export default function PourAmal() {
  const [isSurpriseVisible, setIsSurpriseVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // --- 1. LOGIQUE D'ANIMATION DES CŒURS ---
  const createHeart = () => {
    if (!containerRef.current) return;

    const heart = document.createElement("div");
    heart.classList.add("floating-heart");
    heart.innerHTML = ["❤️", "💖", "💕", "🌹", "🥰"][
      Math.floor(Math.random() * 5)
    ];

    // Position et style aléatoires
    heart.style.left = Math.random() * 100 + "vw";
    heart.style.fontSize = Math.random() * 2 + 1 + "rem";
    heart.style.animationDuration = Math.random() * 3 + 2 + "s";

    containerRef.current.appendChild(heart);

    // Nettoyage après l'animation
    setTimeout(() => {
      heart.remove();
    }, 5000);
  };

  // Lancer la pluie de cœurs au montage du composant
  useEffect(() => {
    const interval = setInterval(createHeart, 300);
    return () => clearInterval(interval); // Nettoyage si on quitte la page
  }, []);

  // --- 2. FONCTION ORAGE (Au clic) ---
  const createHeartStorm = () => {
    for (let i = 0; i < 30; i++) {
      setTimeout(createHeart, i * 50);
    }
  };

  // --- 3. FONCTION SURPRISE ---
  const handleReveal = () => {
    createHeartStorm();
    setIsSurpriseVisible(true);
  };

  return (
    <div className="romantic-page">
      {/* --- INJECTION DU CSS (Style encapsulé) --- */}
      <style jsx global>{`
        @import url("https://fonts.googleapis.com/css2?family=Dancing+Script:wght@700&family=Poppins:wght@300;500&display=swap");

        .romantic-page {
          height: 100vh;
          width: 100vw;
          overflow: hidden;
          font-family: "Poppins", sans-serif;
          background: linear-gradient(
            -45deg,
            #ff9a9e,
            #fad0c4,
            #fad0c4,
            #ffdde1
          );
          background-size: 400% 400%;
          animation: gradientBG 15s ease infinite;
          display: flex;
          justify-content: center;
          align-items: center;
          position: relative;
        }

        @keyframes gradientBG {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }

        .card {
          background: rgba(255, 255, 255, 0.25);
          box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          border-radius: 20px;
          border: 1px solid rgba(255, 255, 255, 0.18);
          padding: 3rem;
          text-align: center;
          max-width: 90%;
          width: 400px;
          position: relative;
          z-index: 10;
          transition: transform 0.3s ease;
        }

        .card:hover {
          transform: translateY(-5px);
        }

        h1 {
          font-family: "Dancing Script", cursive;
          font-size: 3.5rem;
          color: #d63384;
          margin-bottom: 0.5rem;
          text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
        }

        p {
          color: #555;
          font-size: 1.1rem;
          line-height: 1.6;
          margin-bottom: 2rem;
        }

        .heart-container {
          font-size: 4rem;
          margin-bottom: 1rem;
          animation: beat 1s infinite alternate;
          cursor: pointer;
          user-select: none;
        }

        @keyframes beat {
          to {
            transform: scale(1.2);
          }
        }

        .btn {
          background-color: #d63384;
          color: white;
          border: none;
          padding: 12px 30px;
          font-size: 1rem;
          border-radius: 50px;
          cursor: pointer;
          font-family: "Poppins", sans-serif;
          font-weight: 500;
          box-shadow: 0 4px 15px rgba(214, 51, 132, 0.4);
          transition: all 0.3s ease;
        }

        .btn:hover {
          background-color: #a61e61;
          transform: scale(1.05);
        }

        .floating-heart {
          position: absolute;
          bottom: -10vh;
          font-size: 2rem;
          animation: floatUp 4s linear forwards;
          opacity: 0;
          z-index: 1;
          pointer-events: none;
        }

        @keyframes floatUp {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(-110vh) rotate(360deg);
            opacity: 0;
          }
        }

        .hidden-message {
          margin-top: 20px;
          font-weight: bold;
          color: #a61e61;
          animation: fadeIn 1s ease;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>

      {/* CONTENEUR DES CŒURS FLOTTANTS */}
      <div
        ref={containerRef}
        id="hearts-container"
        className="absolute inset-0 pointer-events-none"
      ></div>

      {/* LA CARTE CENTRALE */}
      <div className="card">
        <div className="heart-container" onClick={createHeartStorm}>
          ❤️
        </div>

        <p>À la femme de ma vie,</p>
        <h1>Amal Rezgui</h1>

        {!isSurpriseVisible ? (
          <>
            <p>
              Chaque jour passé avec toi est un cadeau. Tu illumines mon monde.
            </p>
            <button className="btn" onClick={handleReveal}>
              Clique ici mon amour
            </button>
          </>
        ) : (
          <div className="hidden-message">
            Je t'aime plus que tout au monde ! 💖
            <br />
            Merci d'être toi.
          </div>
        )}
      </div>
    </div>
  );
}
