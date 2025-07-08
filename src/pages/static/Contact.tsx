import { Mail, Github, Linkedin } from "lucide-react";

export default function Contact() {
  return (
    <div className="max-w-2xl my-5 mx-5 text-left text-lg text-gray-800 space-y-5">
      <p>
        You can find me at{" "}
        <a
          href="https://palzoltan.net"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline"
        >
          palzoltan.net
        </a>{" "}
        or get in touch via:
      </p>

      <div className="flex items-center gap-3">
        <Mail className="w-6 h-6 text-gray-600" />
        <span className="text-lg">zoomyster@gmail.com</span>
      </div>

      <div className="flex items-center gap-6">
        <a
          href="https://github.com/zoltanpal"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 hover:text-blue-700"
        >
          <Github className="w-6 h-6" />
          <span className="text-lg">GitHub</span>
        </a>

        <a
          href="https://www.linkedin.com/in/zolt%C3%A1n-p%C3%A1l-49368184/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 hover:text-blue-700"
        >
          <Linkedin className="w-6 h-6" />
          <span className="text-lg">LinkedIn</span>
        </a>
      </div>
    </div>
  );
}
