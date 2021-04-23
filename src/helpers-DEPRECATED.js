// const grossSalaryCF = 0.74738;
// const netSalaryCF = 0.67638;

export function calculateWageFund(input, fromType, taxDeductions) {
  const isParameterOn = parameter => taxDeductions.indexOf(parameter) !== -1;

  const socTaxRateDeduction = isParameterOn('soc-tax-rate');
  const taxFreeMinDeduction = isParameterOn('tax-free-min');
  const unempInsurEmployerDeduction = isParameterOn('unemp-insur-employer');
  const unempInsurEmployeeDeduction = isParameterOn('unemp-insur-employee');
  const fundedPensionDeduction = isParameterOn('funded-pension');

  let taxes = {
    wageFund: 0,
    grossSalary: 0,
    netSalary: 0,
    socialTax: 0,
    unemploymentInsuranceYer: 0,
    unemploymentInsuranceYee: 0,
    fundedPension: 0,
    incomeTax: 0
  };

  if (fromType === 'gross') {
    taxes.socialTax = input <= 584 && socTaxRateDeduction ? 192.72 : Number((input * 0.33).toFixed(2));
    taxes.unemploymentInsuranceYer = Number((input * 0.0081).toFixed(2))
    taxes.wageFund = input + taxes.socialTax + taxes.unemploymentInsuranceYer;
    return taxes;
  }

  taxes.incomeTax = Number((input * 0.25).toFixed(2));
  taxes.unemploymentInsuranceYee = Number((input * 0.021).toFixed(2));
  taxes.fundedPension = Number((input * 0.026).toFixed(2));
  taxes.grossSalary = Number((input + taxes.incomeTax + taxes.fundedPension + taxes.unemploymentInsuranceYee).toFixed(2));

  const calculateFromNet = calculateWageFund(taxes.grossSalary, 'gross', taxDeductions);

  taxes.socialTax = calculateFromNet.socialTax;
  taxes.unemploymentInsuranceYer = calculateFromNet.unemploymentInsuranceYer;
  taxes.wageFund = calculateFromNet.wageFund;

  return taxes;
}

export function calculateGrossSalary(input, taxDeductions) {
  const isParameterOn = parameter => taxDeductions.indexOf(parameter) !== -1;

  const socTaxRateDeduction = isParameterOn('soc-tax-rate');
  const taxFreeMinDeduction = isParameterOn('tax-free-min');
  const unempInsurEmployerDeduction = isParameterOn('unemp-insur-employer');
  const unempInsurEmployeeDeduction = isParameterOn('unemp-insur-employee');
  const fundedPensionDeduction = isParameterOn('funded-pension');
  // soc-tax-rate", "tax-free-min", "unemp-insur-employer", "unemp-insur-employee", "funded-pension

  let taxes = {
    grossSalary: 0,
    netSalary: 0,
    socialTax: 0,
    incomeTax: 0,
    unemploymentInsuranceYer: 0,
    unemploymentInsuranceYee: 0,
    fundedPension: 0
  };
  taxes.socialTax = input <= 781 ? 192.72 : Number((input * 0.24664).toFixed(2));
  taxes.incomeTax = Number((input * 0.1441).toFixed(2));
  taxes.unemploymentInsuranceYer = unempInsurEmployerDeduction ? Number((input * 0.00598).toFixed(2)) : 0;
  taxes.unemploymentInsuranceYee = unempInsurEmployeeDeduction ? Number((input * 0.0120).toFixed(2)) : 0;
  taxes.fundedPension = fundedPensionDeduction ? Number((input * 0.0149).toFixed(2)) : 0;
  taxes.grossSalary = Number((input - taxes.socialTax - taxes.unemploymentInsuranceYer).toFixed(2))
  taxes.netSalary = Number((taxes.grossSalary - taxes.incomeTax - taxes.unemploymentInsuranceYee - taxes.fundedPension))

  return taxes;
}

export function calculateTaxFreeIncome(income, period, taxDeductions) {
  const isMonthly = period === 'monthly';
  let amount = income;

  if (isMonthly) {
    amount *= 12;
  }

  const grossAmount = calculateGrossSalary(amount, taxDeductions).grossSalary;
  let taxFreeAmount = 0;

  if (grossAmount <= 14400) {
    taxFreeAmount = grossAmount * 0.036;
  } else if (grossAmount <= 25200) {
    taxFreeAmount = 6000 - 6000 / 10800 * (grossAmount - 14400);
  } else {
    return taxFreeAmount;
  }
  return taxFreeAmount;
}


export function recalculateValues(state) {
  console.log(state);
  const { periodType, taxDeductions } = state;
  let wageAmount = state.parameters.wageAmount;

  const isHourly = periodType === 'hourly';
  const isParameterOn = parameter => taxDeductions.indexOf(parameter) !== -1;
  let taxFreeIncome = 0;

  if (isHourly) {
    wageAmount *= 168;
  }

  taxFreeIncome = calculateTaxFreeIncome(wageAmount, periodType, taxDeductions);


  switch (state.wageType) {
    case 'wage-fund':
      const calculatedGrossSalary = calculateGrossSalary(wageAmount, taxDeductions);
      const {
        grossSalary,
        netSalary,
        socialTax,
        incomeTax,
        unemploymentInsuranceYee,
        unemploymentInsuranceYer,
        fundedPension
      } = calculatedGrossSalary
      return {
        ...state,
        parameters: {
          ...state.parameters,
          wageFund: wageAmount,
          grossSalary,
          netSalary,
          socialTax,
          incomeTax,
          unemploymentInsuranceYer,
          unemploymentInsuranceYee,
          fundedPension,
        }
      };
    case 'gross-salary':
      const calculatedWageFund = calculateWageFund(wageAmount, 'gross', taxDeductions);
      const calculatedGrossSalaryFromWF = calculateGrossSalary(calculatedWageFund.wageFund, taxDeductions)
      return {
        ...state,
        parameters: {
          ...state.parameters,
          wageFund: calculatedWageFund.wageFund,
          grossSalary: wageAmount,
          netSalary: calculatedGrossSalaryFromWF.netSalary,
          socialTax: calculatedGrossSalaryFromWF.socialTax,
          incomeTax: calculatedGrossSalaryFromWF.incomeTax,
          unemploymentInsuranceYer: calculatedGrossSalaryFromWF.unemploymentInsuranceYer,
          unemploymentInsuranceYee: calculatedGrossSalaryFromWF.unemploymentInsuranceYee,
          fundedPension: calculatedGrossSalaryFromWF.fundedPension,
        }
      }

    default:
      const calculatedWageFundFromNetSalary = calculateWageFund(wageAmount, 'net', taxDeductions);
      return {
        ...state,
        parameters: {
          ...state.parameters,
          wageFund: calculatedWageFundFromNetSalary.wageFund,
          grossSalary: calculatedWageFundFromNetSalary.grossSalary,
          netSalary: wageAmount,
          socialTax: calculatedWageFundFromNetSalary.socialTax,
          incomeTax: calculatedWageFundFromNetSalary.incomeTax,
          unemploymentInsuranceYer: calculatedWageFundFromNetSalary.unemploymentInsuranceYer,
          unemploymentInsuranceYee: calculatedWageFundFromNetSalary.unemploymentInsuranceYee,
          fundedPension: calculatedWageFundFromNetSalary.fundedPension,
        }
      }
      break;
  }
}