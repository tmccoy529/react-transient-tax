import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import ExemptionCertificateField from "../forms/ExemptionCertificateField";
import TransientTaxTabs from "../../components/TransientTaxTabs";
import * as Yup from "yup";

const Form4 = props => {
  const {
    nextButton,
    prevButton,
    onValidSubmission,
    tabs,
    isActiveStep,
    label,
    formik
  } = props;

  return (
    <Formik
      initialValues={{ email: "" }}
      onSubmit={values => {
        onValidSubmission(values);
      }}
      validationSchema={Yup.object({
        email: Yup.string()
          .email("Invalid email address")
          .required("Required")
      })}
    >
      {props => (
        <Form>
          <TransientTaxTabs tabs={tabs} activeStep={isActiveStep} />
          <h2>{label}</h2>
          <div className="form-1">
            <ExemptionCertificateField />
          </div>
          {prevButton}
          {nextButton}
        </Form>
      )}
    </Formik>
  );
};

export default Form4;
