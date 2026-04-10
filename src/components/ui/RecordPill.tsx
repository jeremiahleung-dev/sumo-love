export default function RecordPill({
  wins,
  losses,
  absences = 0,
}: {
  wins: number;
  losses: number;
  absences?: number;
}) {
  return (
    <span className="inline-flex items-center gap-1 font-mono text-xs whitespace-nowrap">
      <span className="text-[#22C55E] font-semibold">{wins}W</span>
      <span className="text-[#3F3F46]">–</span>
      <span className="text-[#DC2626] font-semibold">{losses}L</span>
      {absences > 0 && (
        <>
          <span className="text-[#3F3F46]">–</span>
          <span className="text-[#71717A] font-semibold">{absences}A</span>
        </>
      )}
    </span>
  );
}
