export const BENEFIT_GLOWS = [
  { top: "10%", left: "6%", size: 320, opacity: 0.7 },
  { top: "22%", left: "82%", size: 260, opacity: 0.55 },
  { top: "48%", left: "16%", size: 360, opacity: 0.62 },
  { top: "62%", left: "68%", size: 280, opacity: 0.5 },
  { top: "84%", left: "10%", size: 240, opacity: 0.48 },
  { top: "78%", left: "88%", size: 300, opacity: 0.58 },
];

export const TRANSFORMATION_GLOWS = [
  { top: "8%", left: "78%", size: 300, opacity: 0.62 },
  { top: "18%", left: "8%", size: 280, opacity: 0.52 },
  { top: "42%", left: "72%", size: 340, opacity: 0.58 },
  { top: "58%", left: "14%", size: 260, opacity: 0.5 },
  { top: "80%", left: "86%", size: 250, opacity: 0.48 },
  { top: "86%", left: "22%", size: 310, opacity: 0.55 },
];

function SectionGlowLayer({ glows }) {
  return (
    <div className="section-glow-layer" aria-hidden="true">
      {glows.map((glow, index) => (
        <span
          key={index}
          className="section-glow-layer__orb"
          style={{
            top: glow.top,
            left: glow.left,
            width: glow.size,
            height: glow.size,
            opacity: glow.opacity,
          }}
        />
      ))}
    </div>
  );
}

export default SectionGlowLayer;
