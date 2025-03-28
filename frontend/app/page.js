'use client';

import { useRouter } from "next/navigation";
import HomeTab from "./Home/page";

export default function Home() {
  const router = useRouter();

  return (
    <div>
      <main>
        {<HomeTab />}
      </main> 
    </div>
  );
}


