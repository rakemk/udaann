export function UdaanLogo({ size = "md", variant = "icon" }: { size?: "sm" | "md" | "lg"; variant?: "icon" | "full" }) {
  const sizeMap = {
    sm: "h-6 w-6",
    md: "h-10 w-10",
    lg: "h-16 w-16",
  };

  const img = (
    <img src="/udaann-logo.png" alt="UDAANN" className={sizeMap[size]} />
  );

  if (variant === "icon") {
    return img;
  }

  return (
    <div className="flex items-center gap-2">
      <div className={`rounded-lg flex items-center justify-center flex-shrink-0 ${sizeMap[size]}`}>
        {img}
      </div>
      <span className="text-xl font-bold tracking-tight text-[#003D7A]">UDAANN</span>
    </div>
  );
}
