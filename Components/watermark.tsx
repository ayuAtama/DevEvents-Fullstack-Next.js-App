"use client";

import { Suspense, useEffect } from "react";
import { usePathname } from "next/navigation";

const WatermarkWapper = () => {
  const pathname = usePathname();
  useEffect(() => {
    const ascii = `
   _____                   _____   __                         
  /  _  \\ ___.__.__ __    /  _  \\_/  |______    _____ _____   
 /  /_\\  <   |  |  |  \\  /  /_\\  \\   __\\__  \\  /     \\\\__  \\  
/    |    \\___  |  |  / /    |    \\  |  / __ \\|  Y Y  \\/ __ \\_
\\____|__  / ____|____/  \\____|__  /__| (____  /__|_|  (____  /
        \\/\\/                    \\/          \\/      \\/     \\/ 

   👋 Hey there, curious developer!
   💻 Wahyu Pratama welcomes you.
   🚀 https://wahyupratama.web.id
   🐈‍⬛ https://github.com/ayuatama
`;
    console.log(
      `%c${ascii}`,
      "color: #00bcd4; font-weight: bold; font-family: monospace;"
    );
  }, [pathname]);

  return null;
};

export default function ConsoleMessage() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <WatermarkWapper />
    </Suspense>
  );
}
