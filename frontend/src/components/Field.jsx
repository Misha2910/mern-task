export function Field({ label, id, as: Element = "input", ...props }) {
  return (
    <label className="field" htmlFor={id}>
      <span>{label}</span>
      <Element className="field-control" id={id} {...props} />
    </label>
  );
}
