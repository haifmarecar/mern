import { Field, ErrorMessage, useField } from "formik";
import React from "react";

interface FormInputProps {
  label: string;
  name: string;
  type?: string;
  as?: "input" | "select" | "textarea";
  options?: string[]; // For select dropdown
  accept?: string;    // For file input
}

const FormInput: React.FC<FormInputProps> = ({
  label,
  name,
  type = "text",
  as = "input",
  options = [],
  accept,
}) => {
  const [, meta, helpers] = useField(name); // Avoid unused 'field'

  if (type === "file") {
    return (
      <div style={{ marginBottom: "1rem" }}>
        <label>{label}:</label>
        <input
          name={name}
          type="file"
          accept={accept}
          onChange={(e) => {
            helpers.setValue(e.currentTarget.files?.[0]);
          }}
        />
        {meta.touched && meta.error && (
          <div style={{ color: "red" }}>{meta.error}</div>
        )}
      </div>
    );
  }

  return (
    <div style={{ marginBottom: "1rem" }}>
      <label>{label}:</label>
      {as === "select" ? (
        <Field name={name} as="select">
          <option value="">Select an option</option>
          {options.map((opt) => (
            <option value={opt} key={opt}>
              {opt}
            </option>
          ))}
        </Field>
      ) : (
        <Field name={name} type={type} />
      )}

      {/* Correct way to style ErrorMessage */}
      <ErrorMessage
        name={name}
        render={(msg) => <div style={{ color: "red" }}>{msg}</div>}
      />
    </div>
  );
};

export default FormInput;
