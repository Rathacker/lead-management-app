/** The stacked-bars logo mark used in the header and login screen. */
export function BrandMark({ size = 38 }: { size?: number }) {
  return (
    <span
      style={{
        width: size,
        height: size,
        borderRadius: size * 0.29,
        background: "var(--mantine-color-blue-6)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 2.5,
        flexShrink: 0,
      }}
    >
      <span style={{ width: size * 0.45, height: 2.5, borderRadius: 2, background: "#fff" }} />
      <span style={{ width: size * 0.29, height: 2.5, borderRadius: 2, background: "rgba(255,255,255,0.85)" }} />
      <span style={{ width: size * 0.16, height: 2.5, borderRadius: 2, background: "rgba(255,255,255,0.7)" }} />
    </span>
  );
}
