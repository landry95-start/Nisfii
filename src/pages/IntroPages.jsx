import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";


export default function IntroPage() {
  const navigate = useNavigate();

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#F4EADF]">

      
      <motion.div
        initial={{ opacity: 0, scale: 0.7 }}
        animate={{ opacity: 0.5, scale: 1 }}
        transition={{ duration: 2 }}
        className="absolute h-[500px] w-[500px] rounded-full bg-[#E8C9B6] blur-[120px]"
      />

      <div className="relative z-10 flex flex-col items-center text-center">

        
        <motion.img
          src="/../../src/assets/Nisffi.png"
          alt="Logo Anastelle"
          initial={{ opacity: 0, y: -30, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="mb-5 h-20 w-auto object-contain"
        />

        <motion.h1
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="font-['Playfair_Display'] text-6xl font-semibold tracking-wide text-[#211B18] md:text-8xl"
        >
          NISFI
        </motion.h1>


        <motion.p
          initial={{ opacity: 0, letterSpacing: "0px" }}
          animate={{ opacity: 1, letterSpacing: "5px" }}
          transition={{ duration: 1.2, delay: 1.5 }}
          className="mt-4 text-xs font-medium uppercase text-[#98745F] md:text-sm"
        >
          MODE & ACCESSOIRES
        </motion.p>

        
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 2.2 }}
          className="mt-10 text-base text-[#6D5B50] md:text-lg"
        >
          Révélez votre élégance.
        </motion.p>

        
        <motion.button
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, delay: 3.2 }}
          onClick={() => navigate("/home")}
          className="mt-10 rounded-full bg-[#211B18] px-10 py-4 text-sm font-medium text-white shadow-lg transition duration-300 hover:scale-105 hover:bg-[#98745F]"
        >
          Commencer
          <span className="ml-3">→</span>
        </motion.button>

      </div>
    </main>
  );
}
