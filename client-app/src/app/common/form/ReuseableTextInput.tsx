import { useField } from "formik";
import { Form, Label, Input } from "semantic-ui-react";
import { useState } from "react";

interface Props {
  placeholder: string;
  name: string;
  label?: string;
  type?: string;
  showPasswordToggle?: boolean;
}

export default function ReuseableTextInput(props: Props) {
  const [field, meta] = useField(props.name);
  const [showPassword, setShowPassword] = useState(false);
  const isPasswordField = props.type === "password" && props.showPasswordToggle;

  return (
    <Form.Field error={meta.touched && !!meta.error}>
      <label>{props.label}</label>
      <Input
        {...field}
        placeholder={props.placeholder}
        type={isPasswordField && showPassword ? "text" : props.type}
        icon={
          isPasswordField
            ? {
                name: showPassword ? "eye slash" : "eye",
                link: true,
                color: "blue",
                onClick: () => setShowPassword(!showPassword),
              }
            : undefined
        }
      />
      {meta.touched && meta.error ? (
        <Label basic color="red">
          {meta.error}
        </Label>
      ) : null}
    </Form.Field>
  );
}
