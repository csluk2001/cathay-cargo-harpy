import Image from "next/image";
import LoginPage from "./login/page";

import CathayCargoBackgroundImage from "@/public/assets/background/cathay-cargo.jpg";

export default function Home() {
  return (
    <div className="relative w-full h-screen">
      {/* Background Image of Cathay Cargo 747 */}
      <div className="absolute inset-0 z-[-1]">
        <Image
          src={CathayCargoBackgroundImage}
          layout="fill"
          objectFit="cover"
          quality={100}
          className="opacity-20"
          alt="Background"
        />
      </div>

      <LoginPage />
    </div>
  );
}
