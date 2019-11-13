import React from "react";
import * as Yup from "yup";
import { format } from "date-fns";
import { Labels } from "../../common/Constants";
import TaxExemptions from "../TaxExemptions";
import { ErrorMessage, Field, Form, Formik } from "formik";
import PaymentOptions from "../PaymentOptions";
import NetRoomRental from "../NetRoomRental";
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
      const { values } = props;
      const { monthsToReport = [], paymentInterval } = values;

      const buildMonthLabel = monthIndex => {
        const friendlyMonthLabels = Object.keys(monthsToReport).map(key =>
          format(monthsToReport[key], "M/yy")
        );
        return friendlyMonthLabels[monthIndex];
      };

      return (
        <Form>
          <div className="tt_form-section">
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
          </div>
          {/* End of Basic Information Section */}
          <div className="tt_form-section">
            <PaymentOptions />
            <ReturnDateSelector paymentInterval={paymentInterval} />
          </div>
          <div className="tt_form-section">
            <PaymentField
              name="grossOccupancy"
              label={Labels.GrossOccupancy}
              paymentInterval={paymentInterval}
              buildMonthLabel={buildMonthLabel}
            />
          </div>
          <TaxExemptions />
          <NetRoomRental />
          <button type="submit">Submit</button>
        </Form>
      );
    }}
  </Formik>
);

export default TransientTaxForm;
