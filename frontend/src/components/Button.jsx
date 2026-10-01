export default function Button({
  children,
  className = "",
  variant = "primary",
  icon: Icon,
  loading = false,
  ...props
}) {
  return (
    <button
      className={`button button-${variant} ${className}`.trim()}
      disabled={loading || props.disabled}
      {...props}
    >
      {Icon && <Icon aria-hidden="true" size={17} strokeWidth={1.8} />}
      {loading ? "Working…" : children}
    </button>
  );
}
