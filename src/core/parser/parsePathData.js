// --- Parsing Phase ---

const COMMAND_REGEX = /([a-df-zA-DF-Z])([^a-df-zA-DF-Z]*)/g;
const NUMBER_REGEX = /[-+]?\d*\.?\d+(?:e[-+]?\d+)?/g;

const PARAM_COUNTS = {
  M: 2,
  L: 2,
  H: 1,
  V: 1,
  C: 6,
  S: 4,
  Q: 4,
  T: 2,
  A: 7,
  Z: 0,
};

export default function parsePathData(d) {
  const commands = [];
  let match;
  COMMAND_REGEX.lastIndex = 0; // Reset regex state

  while ((match = COMMAND_REGEX.exec(d)) !== null) {
    const commandCode = match[1];
    const paramsString = match[2].trim();
    const upperCode = commandCode.toUpperCase();
    const paramCount = PARAM_COUNTS[upperCode];

    if (paramCount == null) {
      throw new Error(`Unsupported command: ${commandCode}`);
    }

    const params = paramsString.match(NUMBER_REGEX)?.map(parseFloat) || [];

    if (upperCode === "Z") {
      if (params.length > 0)
        throw new Error(`Unexpected parameters for Z command: ${paramsString}`);
      commands.push({ code: upperCode, originalCode: commandCode, values: [] });
      continue; // Z takes no parameters
    }

    if (params.length === 0 && paramCount > 0) {
      // Handle cases like "M" with no coords? Might happen with split strings.
      console.warn(
        `Command ${commandCode} expects ${paramCount} params, but got none. Skipping.`
      );
      continue;
    }

    if (params.length < paramCount) {
      throw new Error(
        `Insufficient parameters for ${commandCode}: expected ${paramCount}, got ${params.length}`
      );
    }

    // Handle commands that can implicitly repeat (like L after M)
    for (let i = 0; i < params.length; i += paramCount) {
      const currentParams = params.slice(i, i + paramCount);
      if (currentParams.length !== paramCount) {
        // This can happen if the last set is incomplete, e.g. M 10 10 20
        throw new Error(
          `Parameter count mismatch for implicit command following ${commandCode}. Expected ${paramCount}, got ${currentParams.length}`
        );
      }

      let effectiveCode = commandCode;
      let effectiveUpperCode = upperCode;

      // Handle implicit L/l after M/m
      if (i > 0 && upperCode === "M") {
        effectiveCode = commandCode === "M" ? "L" : "l";
        effectiveUpperCode = "L";
      }
      // Add similar handling for other commands if needed, though less common

      commands.push({
        code: effectiveUpperCode, // Store uppercase for easier processing later
        originalCode: effectiveCode, // Store original for relative/absolute logic
        values: currentParams,
      });
    }
  }
  return commands;
}
