import { ErrorMessage, Form, Formik } from "formik";
import ReuseableTextInput from "../../app/common/form/ReuseableTextInput";
import { Button, Header } from "semantic-ui-react";
import { observer } from "mobx-react-lite";
import { useStore } from "../../app/stores/store";
import * as Yup from "yup";
import ValidationError from "../errors/ValidationErrors";

export default observer(function RegisterForm() {
  const { userStore, modalStore } = useStore();
  return (
    <Formik
      initialValues={{
        displayName: "",
        username: "",
        email: "",
        password: "",
        error: null,
      }}
      onSubmit={(values, { setErrors }) =>
        userStore.register(values).catch((error) => {
          modalStore.closeModal();
          setErrors({ error });
        })
      }
      validationSchema={Yup.object({
        displayName: Yup.string().required(),
        email: Yup.string().required(),
        password: Yup.string().required(),
        username: Yup.string().required(),
      })}
    >
      {({ handleSubmit, isSubmitting, errors, isValid, dirty }) => (
        <Form
          className="ui form error"
          onSubmit={handleSubmit}
          autoComplete="off"
        >
          <Header
            as="h2"
            content="Sign up to Eventure"
            color="teal"
            textAlign="center"
          />
          <ReuseableTextInput placeholder="Email" name="email" />
          <ReuseableTextInput placeholder="DisplayName" name="displayName" />
          <ReuseableTextInput placeholder="Username" name="username" />
          <ReuseableTextInput
            placeholder="Password"
            name="password"
            type="password"
          />
          <ErrorMessage
            name="error"
            render={() => (
              <ValidationError errors={errors.error as unknown as string[]} />
            )}
          />
          <Button
            loading={isSubmitting}
            positive
            content="Register"
            type="submit"
            fluid
            disabled={!isValid || !dirty || isSubmitting}
          />
        </Form>
      )}
    </Formik>
  );
});
