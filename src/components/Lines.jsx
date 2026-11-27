import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(useGSAP);

// Isang linya. Iginuguhit ito nang isang beses lang: pagka-mount.
function Line({ d, color }) {
  const pathRef = useRef(null);

  useGSAP(() => {
    const path = pathRef.current;
    const length = path.getTotalLength(); // haba ng linya sa pixels

    // "Dash trick": gawing isang mahabang guhit ang linya na nakatago (offset = haba),
    // tapos unti-unting ilabas (offset → 0). Kaya parang iginuguhit.
    gsap.fromTo(
      path,
      { strokeDasharray: length, strokeDashoffset: length },
      {
        strokeDashoffset: 0,
        duration: 0.6,
        ease: 'power2.out',
        clearProps: 'strokeDasharray,strokeDashoffset', // linisin pagkatapos, para hindi masira kapag nag-resize
      }
    );
  });

  return (
    <path
      ref={pathRef}
      d={d}
      fill="none"
      stroke={color}
      strokeWidth={5}
      strokeLinecap="round"
    />
  );
}

// Ang SVG na nakapatong sa dalawang column
export default function Lines({ lines }) {
  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible z-10">
      {lines.map((line) => (
        <Line key={line.key} d={line.d} color={line.color} />
      ))}
    </svg>
  );
}