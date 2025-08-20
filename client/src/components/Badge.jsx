
export default function Badge({ text, type }) {
  const styles = {
    gold: "bg-gradient-to-r from-[#facc15] to-[#eab308] text-black",
    silver: "bg-gradient-to-r from-[#d1d5db] to-[#9ca3af] text-black",
    bronze: "bg-gradient-to-r from-[#fb923c] to-[#f97316] text-white",
    default: "bg-gray-700 text-white",
  };

  return (
    <span
      className={`px-3 py-1 text-sm font-semibold rounded-full shadow-md ${styles[type] || styles.default}`}
    >
      {text}
    </span>
  );
}
