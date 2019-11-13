import * as Yup from "yup";
import { Labels } from "../../common/Constants";
import TaxExemptions from "../TaxExemptions";
import { ErrorMessage, Field, Form, Formik } from "formik";
import PaymentOptions from "../PaymentOptions";
import React from "react";
import ReturnDateSelector from "../ReturnDateSelector";
import PaymentField from "../PaymentField";

const initialValues = {
  accountNumber: "",
  businessName: "",
  address: ""
};

const validationSchema = () => {
  return Yup.object().shape({
    accountNumber: Yup.string()
      .matches(/^[0-9]*$/, "it must be number only")
      .required("Required"),
    businessName: Yup.string()
      .transform(value => (!value ? null : value))
      .required("Required"),
    address: Yup.string().required("Required")
  });
};

const onSubmit = (values, { setSubmitting }) => {
  console.log(values);
  setSubmitting(false);
};

const TransientTaxForm = props => (
  <Formik
    initialValues={initialValues}
    validationSchema={validationSchema}
    onSubmit={onSubmit}
  >
    {props => {
      const { paymentInterval } = props.values;
      return (
        <Form>
          {/* Basic Information Section */}
          <label htmlFor="accountNumber">Account Number</label>
          <div>
            <Field id="accountNumber" name="accountNumber" type="text" />
            <ErrorMessage name="accountNumber" />
          </div>
          <label htmlFor="businessName">Business Name</label>
          <div>
            <Field id="businessName" name="businessName" type="text" />
            <ErrorMessage name="businessName" />
          </div>
          <label htmlFor="address">Address</label>
          <div>
            <Field id="address" name="address" type="text" />
            <ErrorMessage name="address" />
          </div>
          {/* End of Basic Information Section */}
          <PaymentOptions />
          <ReturnDateSelector paymentInterval={paymentInterval} />
          <PaymentField
            name="gross-occupancy"
            label={Labels.GrossOccupancy}
            paymentInterval={paymentInterval}
          />
          <TaxExemptions />
          <button type="submit">Submit</button>
        </Form>
      );
    }}
  </Formik>
);

export default TransientTaxForm;
