export function ItemIcon({
  typeId,
  size = 20,
}: {
  typeId: number | undefined;
  size?: number;
}) {
  if (!typeId) return null;
  return (
    <img
      src={`/icons_3263218/${typeId}.png`}
      width={size}
      height={size}
      style={{ verticalAlign: "middle", borderRadius: "2px", flexShrink: 0 }}
      onError={(e) => {
        (e.target as HTMLImageElement).style.display = "none";
      }}
    />
  );
}
