import * as Yup from "yup";

import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";

import ErrorMessage from "../ErrorMessage";
import { ErrorPath } from "../../common/ErrorUtility";
import { GetFilingTypes } from "../../services/ApiService";
import PaymentOptions from "../PaymentOptions";
import ReturnDateSelector from "../ReturnDateSelectorField";

const PaymentOptionsForm = props => {
  const {
    nextButton,
    prevButton,
    onValidSubmission,
    history,
    formik,
    initialValues
  } = props;
  const [filingTypes, setFilingTypes] = useState([]);
  const [paymentInterval, setPaymentInterval] = useState();
  const {
    paymentInterval: intervalFromFormik,
    monthsToReport: monthsToReportFromFormik
  } = formik.values;

  useEffect(() => {
    if (filingTypes.length === 0) {
      GetFilingTypes()
        .then(filingTypes => {
          setFilingTypes(filingTypes);
        })
        .catch(error => {
          history.push(ErrorPath(error), { ...error });
        });
    }
  }, [filingTypes, history]);

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={values => {
        const { paymentInterval, monthsToReport } = values;
        const hasChange =
          paymentInterval !== intervalFromFormik ||
          monthsToReport !== monthsToReportFromFormik;

        onValidSubmission(values, hasChange);
      }}
      validationSchema={Yup.object({
        paymentInterval: Yup.string()
          .transform(value => (!value ? null : value))
          .required("Required"),
        monthsToReport: Yup.mixed().test(
          "has-months",
          "A date must be selected before you can proceed.",
          value => Object.keys(value).length > 0
        )
      })}
    >
      {setFieldValue => {
        console.log(props);

        const handleOnChange = onClick => {
          console.log("got here to reset form");
          setFieldValue("monthlyData", []);
          setFieldValue("monthsToReport", {});
          setFieldValue("returnStatus", {});
          setFieldValue("exemptions", []);
          setPaymentInterval(onClick.currentTarget.value);
        };

        return (
          <Form>
            <div className="tt_form-section">
              <ErrorMessage name="paymentInterval" component="div" />
              <PaymentOptions
                filingTypes={filingTypes}
                handleOnChange={handleOnChange}
                value={paymentInterval || initialValues.paymentInterval}
              />
              {(paymentInterval || initialValues.paymentInterval) && (
                <React.Fragment>
                  <ReturnDateSelector
                    id="payment-options-date-selector"
                    paymentInterval={paymentInterval}
                    filingTypes={filingTypes}
                    monthsToReport={initialValues.monthsToReport}
                    returnStatus={initialValues.returnStatus}
                  />
                  <ErrorMessage name="monthsToReport" />
                </React.Fragment>
              )}
            </div>
            <div className="tt_form-controls">
              {prevButton}
              {nextButton}
            </div>
          </Form>
        );
      }}
    </Formik>
  );
};

export default PaymentOptionsForm;
