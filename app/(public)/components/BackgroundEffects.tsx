export function BackgroundEffects() {
  return (
    <div className="fixed inset-0 -z-50 overflow-hidden pointer-events-none">
      {/* Base background color - responds to light/dark theme */}
      <div className="absolute inset-0 bg-background transition-colors duration-500" />

      {/* Decorative luxury ambient warm glows */}
      <div className="absolute -top-[15%] -left-[10%] w-[55%] h-[55%] bg-amber-500/10 rounded-full blur-[140px] animate-pulse" />
      <div className="absolute top-[25%] right-[-5%] w-[35%] h-[35%] bg-yellow-600/8 rounded-full blur-[120px]" />
      <div className="absolute -bottom-[15%] -right-[10%] w-[55%] h-[55%] bg-amber-600/10 rounded-full blur-[140px]" />
      <div className="absolute bottom-[25%] left-[5%] w-[35%] h-[35%] bg-orange-400/6 rounded-full blur-[120px]" />
    </div>
  );
}
