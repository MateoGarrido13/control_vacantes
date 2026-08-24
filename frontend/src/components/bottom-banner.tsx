import type { FC } from "react";

interface BottomBannerProps {
  text?: string;
  link?: string;
}

const BottomBanner: FC<BottomBannerProps> = ({
  text = "Hecho con 🩵 por Mateo Garrido",
  link = "https://www.linkedin.com/in/mateo-garrido-sistemas/",
}) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-[#c9d4e0] bg-[#132033] text-white shadow-lg">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <a
          href={link}
          className="flex-1 text-center text-sm hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          target="_blank"
          rel="noreferrer"
        >
          {text}
        </a>
      </div>
    </div>
  );
};

export default BottomBanner;
