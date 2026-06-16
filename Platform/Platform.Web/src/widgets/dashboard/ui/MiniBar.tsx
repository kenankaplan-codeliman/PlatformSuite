interface MiniBarProps {
  percent: number;
}

/** Basit yatay oran çubuğu. */
export function MiniBar({ percent }: MiniBarProps) {
  const p = Math.max(0, Math.min(100, percent));
  return (
    <div style={{ height: 8, borderRadius: 4, background: 'rgba(5,5,5,0.06)', overflow: 'hidden' }}>
      <div style={{ width: `${p}%`, height: '100%', background: '#1677ff', transition: 'width .3s' }} />
    </div>
  );
}
