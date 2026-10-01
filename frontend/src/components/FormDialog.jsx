import { useState } from "react";
import { statuses } from "../constants.js";
import Button from "./Button.jsx";
import { Field } from "./Field.jsx";
import Modal from "./Modal.jsx";

export default function FormDialog({ type, initial, loading, onClose, onSave }) {
  const isProject = type === "project";
  const [values, setValues] = useState({
    name: initial?.name || "",
    title: initial?.title || "",
    description: initial?.description || "",
    status: initial?.status || "Todo",
  });
  const [error, setError] = useState("");
  const fieldName = isProject ? "name" : "title";

  async function submit(event) {
    event.preventDefault();
    setError("");
    try {
      await onSave(
        isProject
          ? { name: values.name.trim(), description: values.description.trim() }
          : {
              title: values.title.trim(),
              description: values.description.trim(),
              status: values.status,
            },
      );
    } catch (saveError) {
      setError(saveError.message);
    }
  }

  return (
    <Modal
      title={`${initial ? "Edit" : "New"} ${isProject ? "project" : "task"}`}
      onClose={onClose}
    >
      <form className="dialog-form" onSubmit={submit}>
        <Field
          id={`dialog-${fieldName}`}
          label={isProject ? "Project name" : "Task title"}
          name={fieldName}
          value={values[fieldName]}
          onChange={(event) =>
            setValues((current) => ({
              ...current,
              [fieldName]: event.target.value,
            }))
          }
          required
          maxLength={isProject ? 100 : 160}
          autoFocus
        />
        <Field
          as="textarea"
          id="dialog-description"
          label="Description"
          name="description"
          value={values.description}
          onChange={(event) =>
            setValues((current) => ({
              ...current,
              description: event.target.value,
            }))
          }
          maxLength={isProject ? 1000 : 2000}
          rows={3}
          placeholder="A few details, if useful"
        />
        {!isProject && (
          <Field
            as="select"
            id="dialog-status"
            label="Status"
            name="status"
            value={values.status}
            onChange={(event) =>
              setValues((current) => ({
                ...current,
                status: event.target.value,
              }))
            }
          >
            {statuses.map((status) => (
              <option key={status} value={status}>{status}</option>
            ))}
          </Field>
        )}
        {error && (
          <p className="form-error" role="alert">
            {error}
          </p>
        )}
        <div className="dialog-actions">
          <Button variant="quiet" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" loading={loading}>
            {initial
              ? "Save changes"
              : `Create ${isProject ? "project" : "task"}`}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
