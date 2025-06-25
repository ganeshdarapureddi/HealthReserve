import Image from 'next/image';

export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-white/50">
      <div className="text-center">
        
        <Image
          src="/icons/circle.gif" 
          alt="Loading..."
          width={100}
          height={100}
          priority
        />
        {/* <p className="mt-4 text-gray-600 text-sm">Loading dashboard...</p> */}
      </div>
    </div>
  );
}
