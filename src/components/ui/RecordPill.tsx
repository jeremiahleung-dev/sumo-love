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
    <span className="inline-flex items-center gap-1 font-mono text-sm">
      <span className="text-[#52B788] font-bold">{wins}W</span>
      <span className="text-white/30">–</span>
      <span className="text-[#C0292A] font-bold">{losses}L</span>
      {absences > 0 && (
        <>
          <span className="text-white/30">–</span>
          <span className="text-[#D4A97A] font-bold">{absences}A</span>
        </>
      )}
    </span>
  );
}
