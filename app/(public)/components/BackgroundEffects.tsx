export function BackgroundEffects() {
  return (
    <div className="fixed inset-0 -z-50 overflow-hidden pointer-events-none">
      {/* Base background color - ensures dark theme consistency */}
      <div className="absolute inset-0 bg-black" />

      {/* Decorative blurred orbs */}
      <div className="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] bg-primary/10 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute top-[20%] right-[0%] w-[30%] h-[30%] bg-blue-500/10 rounded-full blur-[100px]" />
      <div className="absolute -bottom-[10%] -right-[10%] w-[50%] h-[50%] bg-primary/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-[20%] left-[10%] w-[30%] h-[30%] bg-purple-500/10 rounded-full blur-[100px]" />
    </div>
  );
}
