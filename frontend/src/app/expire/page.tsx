import ButtonLink from "@/components/button/ButtonLink";
import NextImage from "next/image";

export default function SessionExpired() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-r from-purple-500 to-red-400 ">
      <div className="flex flex-col items-center justify-center min-w-[450px] bg-white rounded-2xl space-y-5 shadow-2xl p-10">
        <NextImage
          src="/icons/session-expired.png"
          alt="Session Expired"
          width={100}
          height={100}
          className=""
        />
        <h1 className="font-bold mt-4 text-2xl">Your Session is Expired !!</h1>
        <p className="">Please refresh the page to Login Again</p>
        <ButtonLink route={"/login"}>Refresh</ButtonLink>
      </div>
    </div>
  );
}
