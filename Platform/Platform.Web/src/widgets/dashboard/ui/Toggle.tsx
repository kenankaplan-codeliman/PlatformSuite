interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  /** Native hover tooltip. */
  title?: string;
  'aria-label'?: string;
}

/** Switch görünümlü toggle. */
export function Toggle({ checked, onChange, title, 'aria-label': ariaLabel }: ToggleProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={ariaLabel}
      title={title}
      onClick={() => onChange(!checked)}
      style={{
        width: 36,
        height: 20,
        borderRadius: 10,
        border: 'none',
        cursor: 'pointer',
        padding: 2,
        background: checked ? '#1677ff' : 'rgba(0,0,0,0.25)',
        transition: 'background .2s',
        display: 'inline-flex',
        alignItems: 'center',
      }}
    >
      <span
        style={{
          width: 16,
          height: 16,
          borderRadius: '50%',
          background: '#fff',
          transform: checked ? 'translateX(16px)' : 'translateX(0)',
          transition: 'transform .2s',
        }}
      />
    </button>
  );
}
