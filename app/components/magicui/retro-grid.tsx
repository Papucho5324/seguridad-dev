// components/magicui/retro-grid.tsx
export default function RetroGrid() {
  return (
    <div className="absolute inset-0 overflow-hidden opacity-50 [perspective:200px]">
      <div 
        className="absolute inset-0 [transform:rotateX(45deg)]"
        style={{
          backgroundImage: `linear-gradient(to right, rgba(0,0,0,0.1) 1px, transparent 1px), 
                            linear-gradient(to bottom, rgba(0,0,0,0.1) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
          maskImage: "linear-gradient(to top, black 30%, transparent 80%)", // El fix para el bug central
          animation: "grid 15s linear infinite",
        }}
      />
    </div>
  );
}