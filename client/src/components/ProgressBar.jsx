
export default function ProgressBar({ value, max }) {
  const percentage = (value / max) * 100;

  return (
    <div className="w-full bg-[#2a2a3c] rounded-full h-4 shadow-inner">
      <div
        className="h-4 rounded-full bg-gradient-to-r from-[#4ade80] to-[#16a34a] transition-all duration-500"
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
}
