export function numberToWords(num: number): string {
  if (num === 0) return 'Zero';

  const ones = [
    '', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine',
    'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen',
    'Seventeen', 'Eighteen', 'Nineteen'
  ];

  const tens = [
    '', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'
  ];

  const scales = ['', 'Thousand', 'Lakh', 'Crore'];

  function convertHundreds(n: number): string {
    let result = '';
    
    if (n >= 100) {
      result += ones[Math.floor(n / 100)] + ' Hundred ';
      n %= 100;
    }
    
    if (n >= 20) {
      result += tens[Math.floor(n / 10)] + ' ';
      n %= 10;
    }
    
    if (n > 0) {
      result += ones[n] + ' ';
    }
    
    return result.trim();
  }

  function convertIndianNumbering(num: number): string {
    if (num === 0) return 'Zero';
    
    let result = '';
    let scaleIndex = 0;
    
    // Handle crores (10,000,000)
    if (num >= 10000000) {
      const crores = Math.floor(num / 10000000);
      result += convertHundreds(crores) + ' Crore ';
      num %= 10000000;
    }
    
    // Handle lakhs (100,000)
    if (num >= 100000) {
      const lakhs = Math.floor(num / 100000);
      result += convertHundreds(lakhs) + ' Lakh ';
      num %= 100000;
    }
    
    // Handle thousands (1,000)
    if (num >= 1000) {
      const thousands = Math.floor(num / 1000);
      result += convertHundreds(thousands) + ' Thousand ';
      num %= 1000;
    }
    
    // Handle remaining hundreds, tens, and ones
    if (num > 0) {
      result += convertHundreds(num);
    }
    
    return result.trim();
  }

  return convertIndianNumbering(num);
}

export function amountToWords(amount: number): string {
  const rupees = Math.floor(amount);
  const paise = Math.round((amount - rupees) * 100);
  
  let result = 'Rupees ' + numberToWords(rupees);
  
  if (paise > 0) {
    result += ' and ' + numberToWords(paise) + ' Paise';
  }
  
  result += ' Only';
  
  return result;
}