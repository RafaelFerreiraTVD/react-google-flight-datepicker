import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import './styles.scss';
import DateInputGroup from './DateInputGroup';
import Dialog from './Dialog';

const DatePicker = ({
  startDate,
  endDate,
  startDatePlaceholder,
  endDatePlaceholder,
  className,
  disabled,
  onChange,
  onFocus,
  startWeekDay,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);
  const [inputFocus, setInputFocus] = useState('to');
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [hoverDate, setHoverDate] = useState(true);
  const [isFirstTime, setIsFirstTime] = useState(false);

  function handleDocumentClick(e) {
    if (
      containerRef.current
      && containerRef.current.contains(e.target) === false
    ) {
      setIsOpen(false);
    }
  }

  useEffect(() => {
    setIsFirstTime(true);
    if (startDate) {
      startDate.setHours(0);
      startDate.setMinutes(0);
      startDate.setSeconds(0);
      startDate.setMilliseconds(0);
      setFromDate(startDate.getTime());
    }
    if (endDate) {
      endDate.setHours(0);
      endDate.setMinutes(0);
      endDate.setSeconds(0);
      endDate.setMilliseconds(0);
      setToDate(endDate.getTime());
    }

    document.addEventListener('click', handleDocumentClick);

    return () => document.removeEventListener('click', handleDocumentClick);
  }, []);

  useEffect(() => {
    if (isFirstTime) {
      const startDate = fromDate ? new Date(fromDate) : null;
      const endDate = toDate ? new Date(toDate) : null;
      onChange(startDate, endDate);
    }
  }, [fromDate, toDate]);

  useEffect(() => {
    if (isFirstTime) {
      const input = inputFocus === 'from'
        ? 'Start Date'
        : inputFocus === 'to'
          ? 'End Date'
          : '';
      onFocus(input);
    }
  }, [inputFocus]);

  function toggleDialog() {
    setIsOpen(!isOpen);
  }

  function handleClickDateInput(inputFocus) {
    if (disabled) return;

    if (!isOpen) {
      setIsOpen(true);
    }

    if (inputFocus === 'to' && !fromDate) {
      return;
    }

    setInputFocus(inputFocus);
  }

  function onSelectDate(date) {
    if (inputFocus) {
      if (inputFocus === 'from' || (fromDate && date < fromDate)) {
        setFromDate(date);
        if (toDate && date > toDate) {
          setToDate(null);
        }
        setInputFocus('to');
      } else {
        setToDate(date);
        setInputFocus(null);
      }
    } else {
      setFromDate(date);
      setInputFocus('to');
      if (toDate && date > toDate) {
        setToDate(null);
      }
    }
  }

  function onHoverDate(date) {
    setHoverDate(date);
  }

  function handleReset() {
    setInputFocus('from');
    setFromDate(null);
    setToDate(null);
    setHoverDate(null);
  }

  function handleChangeDate(value, input) {
    if (input === 'from') {
      setInputFocus('from');
      setFromDate(value);
      if (value > toDate) {
        setToDate(null);
      }
    } else {
      setInputFocus('to');
      setToDate(value);
    }
  }

  return (
    <div className="react-google-flight-datepicker">
      <div
        className={cx('date-picker', className, {
          disabled,
        })}
        ref={containerRef}
      >
        <DateInputGroup
          handleClickDateInput={handleClickDateInput}
          showCalendarIcon
          fromDate={fromDate}
          toDate={toDate}
          handleChangeDate={handleChangeDate}
          startDatePlaceholder={startDatePlaceholder}
          endDatePlaceholder={endDatePlaceholder}
        />
        <Dialog
          isOpen={isOpen}
          toggleDialog={toggleDialog}
          handleClickDateInput={handleClickDateInput}
          inputFocus={inputFocus}
          setInputFocus={setInputFocus}
          onSelectDate={onSelectDate}
          onHoverDate={onHoverDate}
          fromDate={fromDate}
          toDate={toDate}
          hoverDate={hoverDate}
          handleReset={handleReset}
          handleChangeDate={handleChangeDate}
          startDatePlaceholder={startDatePlaceholder}
          endDatePlaceholder={endDatePlaceholder}
          startWeekDay={startWeekDay}
        />
      </div>
    </div>
  );
};

DatePicker.propTypes = {
  startDate: PropTypes.instanceOf(Date),
  endDate: PropTypes.instanceOf(Date),
  startDatePlaceholder: PropTypes.string,
  endDatePlaceholder: PropTypes.string,
  className: PropTypes.string,
  disabled: PropTypes.bool,
  onChange: PropTypes.func,
  onFocus: PropTypes.func,
  startWeekDay: PropTypes.oneOf(['monday', 'sunday']),
};

DatePicker.defaultProps = {
  startDate: null,
  endDate: null,
  className: '',
  disabled: false,
  startDatePlaceholder: 'Start date',
  endDatePlaceholder: 'End date',
  onChange: () => {},
  onFocus: () => {},
  startWeekDay: 'monday',
};

export default DatePicker;
