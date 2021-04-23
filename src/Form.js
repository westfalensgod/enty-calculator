import React, { useState, useEffect } from 'react';
import { Radio, Typography, Checkbox, Input, Statistic, Timeline, Tooltip } from 'antd';
import { recalculateValues } from './helpers';
import { wageTypeOptions, periodOptions, taxDeductions } from './labels';
import Logo from "./logo.svg";


function Calculator() {
  const [state, setState] = useState({
    wageType: 'wage-fund',
    periodType: 'monthly',
    amountOfHours: 168,
    inputAmount: 1000,
    taxDeductions: ["soc-tax-rate", "tax-free-min", "unemp-insur-employer", "unemp-insur-employee", "funded-pension"],
    parameters: {
      wageAmount: 1000,
      wageFund: 0,
      grossSalary: 0,
      netSalary: 0,
      socialTax: 0,
      incomeTax: 0,
      unemploymentInsuranceYer: 0,
      unemploymentInsuranceYee: 0,
      fundedPension: 0,
    }
  })

  // useEffect(() => {
  //   if (state.periodType === 'hourly') {
  //     const newWageAmount = state.parameters.wageAmount * state.amountOfHours;
  //     handleWageAmountChange(newWageAmount)
  //   }
  // }, [state.periodType, state.amountOfHours])

  useEffect(() => {
    const updatedState = recalculateValues(state);

    setState(updatedState);
  }, [state.parameters.wageAmount, state.wageType, state.periodType, state.taxDeductions])

  const handleWageTypeChange = e => {
    setState({
      ...state,
      wageType: e.target.value
    })
  }

  const handlePeriodChange = e => {
    setState({
      ...state,
      periodType: e.target.value
    })
  }

  const handleWageAmountChange = (e) => {
    const newWageAmount = typeof e.target === 'undefined' ? e : e.target.value;
    const newWageAmountWithHours = newWageAmount * state.amountOfHours;

    if (state.periodType === 'hourly') {
      setState({
        ...state,
        inputAmount: newWageAmount,
        parameters: {
          ...state.parameters,
          wageAmount: newWageAmountWithHours,
        }
      })
    } else {
      setState({
        ...state,
        inputAmount: newWageAmount,
        parameters: {
          ...state.parameters,
          wageAmount: newWageAmount,
        }
      })
    }
  }

  const handleTaxDeductionChange = checkedValues => {
    setState({
      ...state,
      taxDeductions: checkedValues
    })
  }

  const handleAmountOfWorkingHours = hours => {
    setState({
      ...state,
      amountOfHours: hours.target.value,
    })
  }

  return (
    <div className="wrapper">
      <div className="row">
        <div className="column">
          <Typography.Title level={3}>Input Data</Typography.Title>
          <Radio.Group
            options={wageTypeOptions}
            onChange={handleWageTypeChange}
            value={state.wageType}
            optionType="button"
            buttonStyle="solid"
          />
          <br />
          <br />
          <Radio.Group options={periodOptions} onChange={handlePeriodChange} value={state.periodType} />
          <br />
          <br />
          <Input.Group compact style={{ display: "flex", alignItems: 'center' }}>
            <Input
              style={{ width: '35%' }}
              value={state.inputAmount}
              type="number"
              suffix="€"
              onChange={handleWageAmountChange}
            /> <Tooltip style={{ marginLeft: '2px' }} title="Should be more than min. monthly rate of social tax."><span className="question-mark">?</span></Tooltip>
          </Input.Group>
          {state.periodType === 'hourly' && (
            <>
              <br />
              <Input.Group compact>
                <Input
                  style={{ width: '70%', marginRight: '12px' }}
                  value={state.amountOfHours}
                  type="number"
                  suffix="working hours"
                  onChange={handleAmountOfWorkingHours}
                  placeholder="Amount of hours"
                />
              </Input.Group>
            </>
          )}
        </div>
        <div className="column">
          <Typography.Title level={3}>Tax Deductions</Typography.Title>
          <Checkbox.Group style={{ display: "flex", flexDirection: "column" }} options={taxDeductions} value={state.taxDeductions} onChange={handleTaxDeductionChange} />
        </div>
      </div>
      <div className="row">
        <div className="column">
          <Typography.Title level={3}>Information</Typography.Title>
          <div className="row">
            <div className="column">
              <Statistic title="Total Cost for Employer (Wage Fund)" value={state.parameters.wageFund} suffix="€" />
              <br />
              <Timeline>
                <Timeline.Item>Social Tax: <strong>{state.parameters.socialTax}</strong>€</Timeline.Item>
                <Timeline.Item>Unemployment insurance (employer): <strong>{state.parameters.unemploymentInsuranceYer}</strong>€</Timeline.Item>
              </Timeline>
            </div>
            <div className="column">
              <Statistic title="Gross Salary/Wage" value={state.parameters.grossSalary} suffix="€" />
              <br />
              <Timeline>
                <Timeline.Item>Funded pension (II pillar): <strong>{state.parameters.fundedPension}</strong>€</Timeline.Item>
                <Timeline.Item>Unemployment insurance (employee): <strong>{state.parameters.unemploymentInsuranceYee}</strong>€</Timeline.Item>
                <Timeline.Item>Income Tax: <strong>{state.parameters.incomeTax}</strong>€</Timeline.Item>
              </Timeline>
            </div>
            <div className="column">
              <Statistic title="Net Salary/Wage" value={state.parameters.netSalary} suffix="€" />
              <br />
              <br />
              <a className="logo" href="https://enty.io">
                <img style={{ margin: '0 auto' }} src={Logo} alt="enty logo" />
              </a>
            </div>
          </div>
        </div>
        <div className="column"></div>
      </div>
    </div>
  )
}
export default Calculator;