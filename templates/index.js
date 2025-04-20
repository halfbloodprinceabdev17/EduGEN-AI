import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

const Navbar = () => (
  <header className="bg-white shadow-md">
    <div className="max-w-7xl mx-auto p-4 flex justify-between items-center">
      <h1 className="text-2xl font-bold text-blue-600">EduGEN AI</h1>
      <nav className="space-x-4">
        <Link to="/" className="hover:text-blue-500">Home</Link>
        <Link to="/features" className="hover:text-blue-500">Features</Link>
        <Link to="/contact" className="hover:text-blue-500">Contact</Link>
      </nav>
    </div>
  </header>
);

const Hero = () => (
  <section className="text-center py-16 bg-gradient-to-r from-blue-100 to-purple-200">
    <h2 className="text-4xl font-bold mb-4">Your Personal AI Tutor</h2>
    <p className="text-lg max-w-2xl mx-auto">Ask questions, plan lessons, create quizzes, and generate study material—powered by Generative AI.</p>
    <button className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700">Get Started</button>
  </section>
);

const Features = () => (
  <section className="py-12 bg-white">
    <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {[
        { title: "Study Material Generator", desc: "Enter a topic and let AI generate notes, summaries, and explainers." },
        { title: "Ask Doubts", desc: "Interact with the AI assistant and get instant help with any topic." },
        { title: "Quiz Maker", desc: "Generate quizzes on any subject or chapter in seconds." },
        { title: "Lesson Planner", desc: "Generate personalized lesson plans for students or teachers." },
        { title: "Progress Tracker", desc: "Use AI to analyze performance and suggest improvement areas." },
        { title: "Multilingual Support", desc: "Supports learning in multiple languages using AI translation." },
      ].map((item, index) => (
        <div key={index} className="bg-gray-100 p-6 rounded-2xl shadow hover:shadow-lg transition">
          <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
          <p>{item.desc}</p>
        </div>
      ))}
    </div>
  </section>
);

const Contact = () => (
  <section className="bg-blue-50 py-12 text-center">
    <h2 className="text-2xl font-bold mb-4">Contact Us</h2>
    <p className="mb-4">Want to bring EduGEN AI to your school or college?</p>
    <button className="bg-blue-600 text-white px-6 py-2 rounded-xl hover:bg-blue-700">Send Message</button>
  </section>
);

const Footer = () => (
  <footer className="bg-gray-200 text-center py-4">
    <p>&copy; 2025 EduGEN AI. All rights reserved.</p>
  </footer>
);

const App = () => (
  <Router>
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <Routes>
        <Route path="/" element={<>
          <Hero />
          <Features />
          <Contact />
        </>} />
        <Route path="/features" element={<Features />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
      <Footer />
    </div>
  </Router>
);

const container = document.getElementById("root");
const root = createRoot(container);
root.render(<App />);