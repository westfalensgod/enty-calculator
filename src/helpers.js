// export function taxFreeAvailableIncomeFromNet(yearlyNetSalary) {
//   const taxFreeParams = {
//     taxFreePerMonth: 0,
//     taxFreePerYear: 0
//   }

//   let taxFreeIncomeAnnually = 0;

//   if (yearlyNetSalary <= 6000) {
//     taxFreeIncomeAnnually = yearlyNetSalary;
//     taxFreeParams.taxFreePerMonth = taxFreeIncomeAnnually / 12;
//     taxFreeParams.taxFreePerYear = taxFreeIncomeAnnually;
//     return taxFreeParams;
//   } else if (yearlyNetSalary <= 12300) {
//     taxFreeIncomeAnnually = 6000;
//     taxFreeParams.taxFreePerMonth = 6000 / 12;
//     taxFreeParams.taxFreePerYear = 6000;
//     return taxFreeParams;
//   } else if (yearlyNetSalary <= 19428) {

//     return taxFreeParams;
//   } else {
//     return taxFreeParams;
//   }
// }

// export function calculateTaxFreeIncomeFromNet(netSalary, amountOfHours, period) {
//   let yearlyNetSalary = 0;

//   if (period === 'monthly') {
//     yearlyNetSalary = netSalary * 12;
//     return taxFreeAvailableIncomeFromNet(yearlyNetSalary);
//   } else if (period === 'hourly') {
//     yearlyNetSalary = netSalary * amountOfHours * 12;
//     return taxFreeAvailableIncomeFromNet(yearlyNetSalary);
//   } else {
//     yearlyNetSalary = netSalary;
//     return taxFreeAvailableIncomeFromNet(yearlyNetSalary);
//   }
// }

export function taxFreeAvailableIncome(yearlyGrossSalary) {
  const taxFreeParams = {
    taxFreePerMonth: 0,
    taxFreePerYear: 0
  }

  let taxFreeIncomeAnnually = 0;

  if (yearlyGrossSalary <= 518) {
    taxFreeIncomeAnnually = yearlyGrossSalary * 0.036;
    taxFreeParams.taxFreePerMonth = taxFreeIncomeAnnually / 12;
    taxFreeParams.taxFreePerYear = taxFreeIncomeAnnually;
    return taxFreeParams;
  } else if (yearlyGrossSalary <= 14400) {
    taxFreeIncomeAnnually = 6000
    taxFreeParams.taxFreePerMonth = taxFreeIncomeAnnually / 12;
    taxFreeParams.taxFreePerYear = taxFreeIncomeAnnually;
    return taxFreeParams;
  } else if (yearlyGrossSalary <= 25200) {
    taxFreeIncomeAnnually = 6000 - 6000 / 10800 * (yearlyGrossSalary - 14400);
    taxFreeParams.taxFreePerMonth = taxFreeIncomeAnnually / 12;
    taxFreeParams.taxFreePerYear = taxFreeIncomeAnnually;
    return taxFreeParams;
  } else {
    return taxFreeParams;
  }
}

export function calculateTaxFreeIncome(grossSalary, amountOfHours, period) {
  let yearlyGrossSalary = 0;

  if (period === 'monthly') {
    yearlyGrossSalary = grossSalary * 12;
    return taxFreeAvailableIncome(yearlyGrossSalary);
  } else if (period === 'hourly') {
    yearlyGrossSalary = grossSalary * amountOfHours * 12;
    return taxFreeAvailableIncome(yearlyGrossSalary);
  } else {
    yearlyGrossSalary = grossSalary;
    return taxFreeAvailableIncome(yearlyGrossSalary);
  }
}

// export function calculateFromNetSalary(input, taxDeductions, period, amountOfHours) {
//   const isParameterOn = parameter => taxDeductions.indexOf(parameter) !== -1;
//   const socTaxRateDeduction = isParameterOn('soc-tax-rate');
//   const taxFreeMinDeduction = isParameterOn('tax-free-min');
//   const unempInsurEmployerDeduction = isParameterOn('unemp-insur-employer');
//   const unempInsurEmployeeDeduction = isParameterOn('unemp-insur-employee');
//   const fundedPensionDeduction = isParameterOn('funded-pension');

//   const testTest = calculateTaxFreeIncomeFromNet(input);

//   const incomeTaxAmount = 0.2;
//   let grossSalary = input;


//   return calculateFromGrossSalary(grossSalary, taxDeductions, period, amountOfHours);
// }

export function calculateFromGrossSalary(input, taxDeductions, period, amountOfHours) {
  const income = Number(input);
  const isParameterOn = parameter => taxDeductions.indexOf(parameter) !== -1;
  const socTaxRateDeduction = isParameterOn('soc-tax-rate');
  // const taxFreeMinDeduction = isParameterOn('tax-free-min');
  const unempInsurEmployerDeduction = isParameterOn('unemp-insur-employer');
  // const unempInsurEmployeeDeduction = isParameterOn('unemp-insur-employee');
  // const fundedPensionDeduction = isParameterOn('funded-pension');

  const socTaxAmount = socTaxRateDeduction && income < 194 ? 192.72 : income * 0.33202;
  const unemploymentInsuranceImployer = unempInsurEmployerDeduction ? income * 0.00598 : 0;

  let wageFund = income + socTaxAmount + unemploymentInsuranceImployer;

  return calculateFromWageFund(wageFund, taxDeductions, period, amountOfHours);
}

export function calculateFromWageFund(input, taxDeductions, period, amountOfHours) {
  const isParameterOn = parameter => taxDeductions.indexOf(parameter) !== -1;
  const socTaxRateDeduction = isParameterOn('soc-tax-rate');
  const taxFreeMinDeduction = isParameterOn('tax-free-min');
  const unempInsurEmployerDeduction = isParameterOn('unemp-insur-employer');
  const unempInsurEmployeeDeduction = isParameterOn('unemp-insur-employee');
  const fundedPensionDeduction = isParameterOn('funded-pension');

  const taxes = {
    wageFund: input,
    grossSalary: 0,
    incomeBeforeNet: 0,
    netSalary: 0,
    socialTax: 0,
    incomeTax: 0,
    unemploymentInsuranceYer: 0,
    unemploymentInsuranceYee: 0,
    fundedPension: 0
  };
  // convert hourly to monthly salary
  // if (period === 'hourly') {
  //   taxes.wageFund = input * amountOfHours;
  // }

  // gross salary from wage
  taxes.socialTax = input <= 781 && socTaxRateDeduction ? 192.72 : unempInsurEmployerDeduction ? Number((input * 0.24664).toFixed(2)) : Number((input * 0.24812).toFixed(2));
  taxes.grossSalary = input - taxes.socialTax;
  taxes.unemploymentInsuranceYer = unempInsurEmployerDeduction && input >= 194 ? Number((input * 0.00598).toFixed(2)) : 0;
  taxes.grossSalary = unempInsurEmployerDeduction ? taxes.grossSalary - taxes.unemploymentInsuranceYer : taxes.grossSalary + Number((input * 0.00598).toFixed(2));

  // find out if a user has tax free income
  const taxFreeIncome = calculateTaxFreeIncome(taxes.grossSalary, amountOfHours, period);
  let taxableIncome = taxes.grossSalary;

  if (taxFreeMinDeduction) {
    if (period === 'monthly') {
      taxableIncome = taxes.grossSalary - taxFreeIncome.taxFreePerMonth;
      taxes.netSalary = taxFreeIncome.taxFreePerMonth;
    } else {
      // period === 'yearly'
      if (taxes.grossSalary <= taxFreeIncome.taxFreePerYear) {
        taxableIncome = 0;
        taxes.netSalary = taxes.grossSalary;
      } else {
        taxableIncome = taxes.grossSalary - taxFreeIncome.taxFreePerYear;
        taxes.netSalary = taxFreeIncome.taxFreePerYear;
      }
    }
  }

  // net salary from gross (reads as income before becoming net)
  taxes.unemploymentInsuranceYee = unempInsurEmployeeDeduction ? Number((taxes.grossSalary * 0.016).toFixed(2)) : 0;
  taxableIncome = unempInsurEmployeeDeduction ? taxableIncome - taxes.unemploymentInsuranceYee : taxableIncome + Number((taxes.grossSalary * 0.016).toFixed(2));

  taxes.fundedPension = fundedPensionDeduction ? Number((taxes.grossSalary * 0.02).toFixed(2)) : 0; // можно не платить, тогда уходит плюсом в net
  taxableIncome = fundedPensionDeduction ? taxableIncome - taxes.fundedPension : taxableIncome;

  taxes.incomeTax = taxableIncome > 0 ? input <= 715 ? 0 : Number((taxableIncome * 0.2).toFixed(2)) : 0;
  taxableIncome -= taxes.incomeTax;

  taxes.netSalary += taxableIncome;

  for (let prop in taxes) {
    taxes[prop] = Number.parseFloat(taxes[prop]).toFixed(2);
  }

  return taxes;
}

export function recalculateValues(state) {
  const { wageType, periodType, taxDeductions, amountOfHours, parameters: { wageAmount } } = state;

  if (wageType === 'wage-fund') {
    const wageFundParams = calculateFromWageFund(wageAmount, taxDeductions, periodType, amountOfHours);
    return {
      ...state,
      parameters: {
        ...state.parameters,
        wageFund: wageAmount,
        grossSalary: wageFundParams.grossSalary,
        netSalary: wageFundParams.netSalary,
        socialTax: wageFundParams.socialTax,
        incomeTax: wageFundParams.incomeTax,
        unemploymentInsuranceYer: wageFundParams.unemploymentInsuranceYer,
        unemploymentInsuranceYee: wageFundParams.unemploymentInsuranceYee,
        fundedPension: wageFundParams.fundedPension,
      }
    }
  } else {
    const grossSalaryParams = calculateFromGrossSalary(wageAmount, taxDeductions, periodType, amountOfHours);
    return {
      ...state,
      parameters: {
        ...state.parameters,
        wageFund: grossSalaryParams.wageFund,
        grossSalary: wageAmount,
        netSalary: grossSalaryParams.netSalary,
        socialTax: grossSalaryParams.socialTax,
        incomeTax: grossSalaryParams.incomeTax,
        unemploymentInsuranceYer: grossSalaryParams.unemploymentInsuranceYer,
        unemploymentInsuranceYee: grossSalaryParams.unemploymentInsuranceYee,
        fundedPension: grossSalaryParams.fundedPension,
      }
    }
  }
}