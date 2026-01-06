"use client";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-start p-8 pt-24 space-y-12">

      {/* Header */}
      <header className="w-full max-w-4xl flex flex-col items-center space-y-4">
        <h1 className="text-5xl font-extrabold text-gray-800">issah1554</h1>
        <p className="text-lg text-gray-600 text-center">
          Welcome to issah1554 - your personal hub for projects, learning, and more.
        </p>
        <nav className="flex space-x-6 mt-4">
          <a href="#about" className="text-gray-700 hover:text-primary transition">About</a>
          <a href="#projects" className="text-gray-700 hover:text-primary transition">Projects</a>
          <a href="#contact" className="text-gray-700 hover:text-primary transition">Contact</a>
        </nav>
      </header>



      {/* Contact Section */}
      <section id="contact" className="w-full max-w-4xl bg-white rounded-lg shadow p-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Contact</h2>
        <form className="flex flex-col space-y-4">
          <input
            type="text"
            placeholder="Your Name"
            className="border border-gray-300 rounded-lg p-3 focus:outline-accent text-neutral-500"
          />
          <input
            type="email"
            placeholder="Your Email"
            className="border border-gray-300 rounded-lg p-3 focus:outline-accent text-neutral-500"
          />
          <textarea
            placeholder="Message"
            className="border border-gray-300 rounded-lg p-3 focus:outline-accent"
            rows={4}
          />
          <button className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-600 transition self-end">
            Send Message
          </button>
        </form>
      </section>

      {/* Projects Section (Moved down + links added) */}
      <section id="projects" className="w-full max-w-4xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

        <a
          href="https://www.ardhi.co.tz/"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-accent text-white p-6 rounded-lg shadow-lg hover:scale-105 hover:shadow-2xl transform transition block"
        >
          <h3 className="text-xl font-semibold">Project One</h3>
          <p className="mt-2 text-gray-100">A brief description of project one.</p>
        </a>

        <a
          href="https://example.com/project2"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-success text-white p-6 rounded-lg shadow-lg hover:scale-105 hover:shadow-2xl transform transition block"
        >
          <h3 className="text-xl font-semibold">Project Two</h3>
          <p className="mt-2 text-gray-100">A brief description of project two.</p>
        </a>

        <a
          href="https://example.com/project3"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-secondary text-white p-6 rounded-lg shadow-lg hover:scale-105 hover:shadow-2xl transform transition block"
        >
          <h3 className="text-xl font-semibold">Project Three</h3>
          <p className="mt-2 text-gray-100">A brief description of project three.</p>
        </a>

      </section>

      {/* Footer */}
      <footer className="w-full text-center text-gray-500 mt-12">
        &copy; {new Date().getFullYear()} issah1554. All rights reserved.
      </footer>

    </div>
  );
}
