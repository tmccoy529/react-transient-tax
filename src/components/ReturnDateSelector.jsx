import {
  GetDueDateStatus,
  GetFormatedDateTime,
  GetFormattedDueDate
} from "../common/DatesUtilities";
import React, { useEffect, useState } from "react";

import DatePicker from "react-datepicker";
import { GetIdByDescription } from "../common/LookupUtilities";
import { Labels } from "../common/Constants";
import PropTypes from "prop-types";
import { addMonths } from "date-fns";
import { connect } from "formik";

const ReturnInterval = props => {
  const { paymentInterval, filingTypes, formik } = props;
  const { setFieldValue } = formik;
  const [returnInterval, setReturnInterval] = useState({});
  const { months = {}, dueDate, status = {} } = returnInterval;
  const monthlyId = GetIdByDescription(filingTypes, "monthly");
  const isMonthly = parseInt(paymentInterval) === monthlyId;
  const monthsToSelect = new Array(isMonthly ? 1 : 3).fill(
    null
  ); /** 3 months per quarter */
  const startDate = new Date();

  /**
   * Handle any of the month / year selection changes
   * @param {date} date js date object for selected month and
   * @param {number} monthIndex tells us which month the
   */
  const handleDateChange = (date, monthIndex) => {
    if (date !== null) {
      const months = { ...returnInterval.months };
      const isFirstMonthInQuarter = monthIndex === 0;
      let lastFilingMonth = date;
      months[monthIndex] = date;

      // If this is a quarterly report, assume the next two months but leave them editable
      if (!isMonthly && isFirstMonthInQuarter) {
        const nextMonth = addMonths(date, 1);
        const finalMonthInQuarter = addMonths(date, 2);

        months[1] = nextMonth;
        months[2] = finalMonthInQuarter;
        lastFilingMonth = finalMonthInQuarter;
      }

      const monthlyData = Object.keys(months).map(monthKey => {
        const date = months[monthKey];
        return {
          month: date.getMonth() + 1,
          year: date.getFullYear()
        };
      });

      const dueDate = GetFormattedDueDate(lastFilingMonth);
      const status = GetDueDateStatus(lastFilingMonth, new Date());
      const { isLate, value } = status;

      setFieldValue("monthlyData", monthlyData);
      setFieldValue("monthsToReport", months);
      setFieldValue("dueDate", dueDate);
      setFieldValue("monthsLate", isLate ? value : 0);
      setFieldValue("isReturnLate", isLate);

      setReturnInterval({
        status,
        dueDate,
        months
      });
    }
  };

  /**
   * Gets a friendly label for each month
   * @param {number} monthIndex zero based representation of which month in the sequence it is
   */
  const getMonthLabel = monthIndex => {
    if (isMonthly) {
      return "Month";
    }
    switch (monthIndex) {
      case 0: {
        return "1st Month";
      }
      case 1: {
        return "2nd Month";
      }
      case 2: {
        return "3rd Month";
      }
      default: {
        return;
      }
    }
  };

  const getMonth = (months, monthIndex) => {
    if (Object.entries(months).length > 0) {
      const month = months[monthIndex];
      return month ? GetFormatedDateTime(new Date(month), "MM/yyyy") : "";
    }
  };

  /** Reset Return Interval Data */
  useEffect(() => {
    setReturnInterval({});
  }, [paymentInterval]);

  return (
    <React.Fragment>
      <div>
        <label htmlFor="month-date-picker-0">
          Month{isMonthly ? "" : "s"} for Return
        </label>
        <div className="tt_month-pickers">
          {monthsToSelect.map((month, monthIndex) => {
            const id = `month-date-picker-${monthIndex}`;
            return (
              <div className="tt_month-picker" key={monthIndex}>
                {Object.entries(months).length > 0 || monthIndex === 0 ? (
                  <label htmlFor={id}>{getMonthLabel(monthIndex)}</label>
                ) : null}
                {monthIndex === 0 ? (
                  <DatePicker
                    id={id}
                    selected={months[monthIndex]}
                    onChange={date => handleDateChange(date, monthIndex)}
                    startDate={startDate}
                    dateFormat="MM/yyyy"
                    monthsToReport={months}
                    showMonthYearPicker
                  />
                ) : (
                  <p>{getMonth(months, monthIndex)}</p>
                )}
              </div>
            );
          })}
        </div>
      </div>
      {dueDate && status.label && (
        <div className="tt_form-group">
          <p>
            <span className="emphasize-text">{Labels.DueDate}</span>: {dueDate}
          </p>
          <p>
            {status.label === Labels.PastDue && (
              <i
                className="fas fa-exclamation-circle tt_past-due-icon"
                aria-hidden="true"
              ></i>
            )}
            <span>{status.label}</span>: {status.message}
          </p>
        </div>
      )}
    </React.Fragment>
  );
};

ReturnInterval.propTypes = {
  /** 'monthly' or 'quarterly' which allows us to control the ui accordingly  */
  paymentInterval: PropTypes.string
};

export default connect(ReturnInterval);
