import Image from "next/image";
import { menu } from "@/config/menu";
import { Card } from "@/components/ui/card";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <div className="flex flex-col items-center justify-center w-full">
        <div className="text-3xl mb-3">
          Test finale
        </div>
        <div className="text-sm text-zinc-600">
          Luca Giovannini ITS Full Stack Web Developer 
        </div>
      </div>
      <div className="flex flex-col items-center">
        {menu.map(m => (
          <Link key={m.id} href={m.url}>
            <Card className="mt-6">
              <div className="p-3 w-[200px] flex justify-center" key={m.id}>{m.page}</div>
            </Card>
          </Link>
        ))}
      </div>
    </>
  );
}
