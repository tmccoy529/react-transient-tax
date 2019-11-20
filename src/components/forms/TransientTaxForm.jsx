import React from "react";
import * as Yup from "yup";
import { format } from "date-fns";
import { Labels } from "../../common/Constants";
import { Form, Formik } from "formik";
import ExemptionCertificateField from "./ExemptionCertificateField";
import { GetCalculatedTotals } from "../../common/Calculations";
import BasicInformationSection from "./BasicInformationSection";
import PaymentSelectionSection from "./PaymentSelectionSection";
import IdentificationSection from "./IdentificationSection";
import GrossOccupancySection from "./GrossOccupancySection";
import ExemptionsSection from "./ExemptionsSection";
import TransientTaxSection from "./TransientTaxSection";

const initialValues = {
  accountNumber: "",
  businessName: "",
  address: "",
  paymentInterval: "",
  grossOccupancy: 0,
  roomRentalCollectionFromNonTransients: 0,
  governmentOnBusiness: 0,
  exemptions: [],
  monthsLate: 0,
  monthsToReport: {},
  submittedBy: "",
  title: "",
  email: "",
  exemptionMessage: ""
};

const validationSchema = () => {
  return Yup.object().shape({
    accountNumber: Yup.string()
      .matches(/^[0-9]*$/, "it must be number only")
      .required("Required"),
    businessName: Yup.string()
      .transform(value => (!value ? null : value))
      .required("Required"),
    address: Yup.string().required("Required"),
    submittedBy: Yup.string()
      .transform(value => (!value ? null : value))
      .required("Required"),
    title: Yup.string()
      .transform(value => (!value ? null : value))
      .required("Required"),
    email: Yup.string()
      .email("Please enter a valid email address.")
      .required("Please enter your email address.")
  });
};

const onSubmit = (
  values,
  { setFieldValue, setSubmitting }
) => {
  const {
    grossOccupancy,
    roomRentalCollectionFromNonTransients,
    governmentOnBusiness,
    monthsToReport,
    monthsLate,
    exemptions
  } = values;
  
  const { totalExemptions } = GetCalculatedTotals(
    {
      grossOccupancy,
      roomRentalCollectionFromNonTransients,
      governmentOnBusiness
    },
    monthsToReport,
    monthsLate
  );
  const errorsReturned = "At least 1 exemption record is required.";
  if (totalExemptions[0] !== 0 && exemptions.length === 0) {
    setFieldValue("exemptionMessage", errorsReturned);
  } else {
    setFieldValue("exemptionMessage", null);
  }
  setSubmitting(false);
};

const TransientTaxForm = componentProps => (
  <Formik
    initialValues={initialValues}
    validationSchema={validationSchema}
    onSubmit={onSubmit}
  >
    {props => {
      const { values } = props;
      const {
        grossOccupancy,
        roomRentalCollectionFromNonTransients,
        governmentOnBusiness,
        monthsToReport = [],
        paymentInterval,
        monthsLate = 0
      } = values;
      const {
        totalExemptions,
        netRoomRentalCollections,
        transientTaxCollected,
        transientInterest,
        transientPenalty,
        totalInterestAndPenalties,
        monthlyTaxRemitted
      } = GetCalculatedTotals(
        {
          grossOccupancy,
          roomRentalCollectionFromNonTransients,
          governmentOnBusiness
        },
        monthsToReport,
        monthsLate
      );
      const isPaymentIntervalSelected = Object.keys(monthsToReport).length > 0;
      const hasExemptions = Object.keys(totalExemptions).some(
        exemptionIndex =>
          totalExemptions[exemptionIndex] <
          0 /** exemption totals are negative values */
      );
      const buildMonthLabel = monthIndex => {
        const friendlyMonthLabels = Object.keys(monthsToReport).map(key =>
          format(monthsToReport[key], "M/yy")
        );
        return friendlyMonthLabels[monthIndex];
      };
      const labelMessage = values.exemptionMessage;
      const exemptionLength = values.exemptions.length;

      return (
        <Form>
          <BasicInformationSection />
          <PaymentSelectionSection paymentInterval={paymentInterval} />
          {isPaymentIntervalSelected && (
            <React.Fragment>
              <GrossOccupancySection
                label={Labels.GrossOccupancy}
                monthsToReport={monthsToReport}
                buildMonthLabel={buildMonthLabel}
              />
              <ExemptionsSection
                labels={Labels}
                monthsToReport={monthsToReport}
                buildMonthLabel={buildMonthLabel}
                totalExemptions={totalExemptions}
                netRoomRentalCollections={netRoomRentalCollections}
              />
              <TransientTaxSection
                labels={Labels}
                transientTaxCollected={transientTaxCollected}
                transientInterest={transientInterest}
                transientPenalty={transientPenalty}
                totalInterestAndPenalties={totalInterestAndPenalties}
                monthlyTaxRemitted={monthlyTaxRemitted}
              />
            </React.Fragment>
          )}
          {hasExemptions && <ExemptionCertificateField />}
          {hasExemptions && exemptionLength === 0 ? labelMessage : null}
          {isPaymentIntervalSelected && (
            <React.Fragment>
              <IdentificationSection />
              <button type="submit">Submit</button>
            </React.Fragment>
          )}
        </Form>
      );
    }}
  </Formik>
);

export default TransientTaxForm;
