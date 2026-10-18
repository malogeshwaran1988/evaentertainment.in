/** EVA-branded "Sending…" indicator: gold/green audio waveform (static under reduced motion). */
export default function SendingIndicator({ label = "Sending…" }: { label?: string }) {
  return (
    <span className="eva-sending">
      <span className="eva-sending-wave" aria-hidden="true">
        <i />
        <i />
        <i />
        <i />
        <i />
      </span>
      <span className="eva-sending-label">{label}</span>
    </span>
  );
}
