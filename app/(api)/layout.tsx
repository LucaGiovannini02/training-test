import Link from "next/link";

export default function Layout({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
  return (
    <div className="mt-3">
        <Link className="ml-3" href="/">&#8592; Back to home</Link>
        <div className="w-full flex justify-center">
          <div className="w-[900px]">
            {children}
          </div>
        </div>
    </div>
  );
}
