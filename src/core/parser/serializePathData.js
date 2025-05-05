// --- Serialization Phase ---
const PRECISION = 4; // Adjust decimal places as needed

export default function serializePathData(commands) {
  return commands
    .map((cmd) => {
      const formatNumber = (num) => num.toFixed(PRECISION); // Control precision

      switch (cmd.code) {
        case "M":
          return `M${formatNumber(cmd.x)},${formatNumber(cmd.y)}`;
        case "L":
          return `L${formatNumber(cmd.x)},${formatNumber(cmd.y)}`;
        case "T":
          return `T${formatNumber(cmd.x)},${formatNumber(cmd.y)}`;
        // Output H and V as L commands for robustness after arbitrary transforms
        case "H":
          return `L${formatNumber(cmd.x)},${formatNumber(cmd.y)}`;
        case "V":
          return `L${formatNumber(cmd.x)},${formatNumber(cmd.y)}`;
        case "C":
          return `C${formatNumber(cmd.x1)},${formatNumber(
            cmd.y1
          )} ${formatNumber(cmd.x2)},${formatNumber(cmd.y2)} ${formatNumber(
            cmd.x
          )},${formatNumber(cmd.y)}`;
        case "S":
          return `S${formatNumber(cmd.x2)},${formatNumber(
            cmd.y2
          )} ${formatNumber(cmd.x)},${formatNumber(cmd.y)}`;
        case "Q":
          return `Q${formatNumber(cmd.x1)},${formatNumber(
            cmd.y1
          )} ${formatNumber(cmd.x)},${formatNumber(cmd.y)}`;
        case "A":
          return `A${formatNumber(cmd.rx)},${formatNumber(
            cmd.ry
          )} ${formatNumber(cmd.xAxisRotation)} ${cmd.largeArcFlag ? 1 : 0},${
            cmd.sweepFlag ? 1 : 0
          } ${formatNumber(cmd.x)},${formatNumber(cmd.y)}`; // NOTE: rx, ry, xAxisRotation are UNTRANSFORMED
        case "Z":
          return "Z";
        default:
          throw new Error(
            `Unhandled command code in serializePathData: ${cmd.code}`
          );
      }
    })
    .join(" "); // Use space separator
}
