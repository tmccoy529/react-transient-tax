import React from "react";
import PropTypes from "prop-types";
import classnames from "classnames";
import PaymentTotalLabel from "./PaymentTotalLabel";

const PaymentTotal = props => {
  const { label, total = 0, name, className, isNegativeValue = false } = props;
  const cssClasses = classnames("tt_form-group total", className);

  return (
    <div className={cssClasses}>
      <label className="tt_total-label">{label}</label>
      <div className="tt_currency-pickers">
        <PaymentTotalLabel
          key={`payment-total-label-${name}`}
          name={name}
          total={total}
          isNegativeValue={isNegativeValue}
        />
      </div>
    </div>
  );
};

PaymentTotal.propTypes = {
  /** Label to describe the total */
  label: PropTypes.string.isRequired,
  /**  Gives a unique key to the totals */
  name: PropTypes.string.isRequired,
  /** Total value */
  total: PropTypes.number
};

export default PaymentTotal;
