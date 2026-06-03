import { Skeleton } from "moti/skeleton";
import { useWindowDimensions } from "react-native";
import { useTheme } from "../context/ThemeContext";

type Props = {
  width: number | string;
  height: number;
  radius?: number;
};

export default function SkeletonBox({
  width,
  height,
  radius = 8,
}: Props) {
  const { isDark } = useTheme();
  const { width: screenWidth } = useWindowDimensions();

  const baseColor = isDark ? "#334155" : "#E5E7EB";
  const highlightColor = isDark ? "#475569" : "#F3F4F6";

  let resolvedWidth: number;
    if (typeof width === "string" && width.includes("%")) {
    const percent = parseFloat(width.replace("%", ""));
    resolvedWidth = screenWidth * (percent / 100);
  } else if (typeof width === "string") {
    resolvedWidth = Number(width);
  } else {
    resolvedWidth = width;
  }


  return (
    <Skeleton
      width={resolvedWidth}
      height={height}
      radius={radius}
      colors={[baseColor, highlightColor]}
    />
  );
}