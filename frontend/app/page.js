'use client';

import { useRouter } from "next/navigation";
import HomeTab from "./home/page";

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