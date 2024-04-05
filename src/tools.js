export function divideMatrix(m1, m2) {
  const _m = {}
  Object.keys(m1).map(key=>{
    _m[key] = divideArrays(m1[key],m2[key])
  })
  return _m;
}

export function divideArrays(m1,m2){
  let result = [];
  for (let i = 0; i < m1.length; i++) {
      if(m1[i]===0){
        result.push(0);
      } else {
        result.push((m1[i] / m2[i]));
      }
  }
  return result;
} 


export function timesMatrix(m1, m2) {
  const _m = {}
  Object.keys(m1).map(key=>{
    _m[key] = timesArrays(m1[key],m2[key])
  })
  return _m;
}

export function processMatrix(m1,processor){
  const _m = {}
  Object.keys(m1).map(key=>{
    _m[key] = m1[key].map(processor);
  })
  return _m;
}

export function processMatrixes(m1, m2, processor) {
  const _m = {};
  Object.keys(m1).forEach(key => {
    const _a = [];
    const arr1 = m1[key];
    const arr2 = m2[key];
    for (let i = 0; i < arr1.length; i++) {
      _a.push(processor(arr1[i], arr2[i]));
    }
    _m[key] = _a;
  });
  return _m;
}

export function timesMatrixByNumber(m1, a) {
  const _m = {}
  Object.keys(m1).map(key=>{
    _m[key] = m1[key].map(it=>it*a);
  })
  return _m;
}

export function timesArrays(m1,m2){
  let result = [];
  for (let i = 0; i < m1.length; i++) {
      if(m1[i]===0){
        result.push(0);
      } else {
        result.push(m1[i] * m2[i]);
      }
  }
  return result;
} 

export function plusMatrix(m1, m2) {
  const _m = {}
  Object.keys(m1).map(key=>{
    _m[key] = plusArrays(m1[key],m2[key])
  })
  return _m;
}

export function plusArrays(m1,m2){
  let result = [];
  for (let i = 0; i < m1.length; i++) {
      if(m1[i]===0){
        result.push(0);
      } else {
        result.push(~~m1[i] + ~~m2[i]);
      }
  }
  return result;
} 

export function minusMatrix(m1, m2) {
  const _m = {}
  Object.keys(m1).map(key=>{
    _m[key] = minusArrays(m1[key],m2[key])
  })
  return _m;
}

export function minusMatrixArray(m1, m2, colum) {
  const _m = {}
  if(colum){
    Object.keys(m1).map((key,i)=>{
      _m[key] = m1[key].map(it=>it-m2[i]);
    })
  }else{
    Object.keys(m1).map(key=>{
      _m[key] = minusArrays(m1[key],m2)
    })
  }
  return _m;
}

export function minusArrays(m1,m2){
  let result = [];
  for (let i = 0; i < m1.length; i++) {
      if(m1[i]===0){
        result.push(0);
      } else {
        result.push(~~m1[i] - ~~m2[i]);
      }
  }
  return result;
} 

export function roundToDecimal(num, decimalPlaces) {
    if (!isNaN(num)) {
        // 将数字四舍五入到指定的小数位数
        const roundedNum = (~~num).toFixed(decimalPlaces);
        // 将结果转换为数字类型并返回
        return parseFloat(roundedNum);
    } else {
        // 如果输入不是数字，则返回原始值
        return num;
    }
}

export function checkNumbers(obj, decimalPlaces) {
  let maxUnit = '元';
  let result = {};

  for (const key in obj) {
      if (Object.hasOwnProperty.call(obj, key)) {
          const numbers = obj[key];
          const maxNumber = Math.max(...Object.values(obj).flat());

          if (maxNumber >= 100000000) {
              maxUnit = '亿';
              result[key] = numbers.map(num => (num / 100000000).toFixed(decimalPlaces));
          } else if (maxNumber >= 10000) {
              maxUnit = '万';
              result[key] = numbers.map(num => (num / 10000).toFixed(decimalPlaces));
          } else {
              result[key] = numbers.map(num => num.toFixed(decimalPlaces));
          }
      }
  }

  return { unit: maxUnit, result, originData:obj };
}

// 格式化函数，将数值转换为带有百分号的字符串
export function formatAsPercentage(value) {
  if (value === '' || value === null) {
    return value;
  }
  return (value * 100) + '%';
}

// 解析函数，将带有百分号的字符串解析为数值
export function parsePercentage(value) {
  if (value === '' || value === null) {
    return value;
  }
  const parsedValue = value.replace('%', '');
  return parsedValue ? parseFloat(parsedValue) / 100 : 0;
}

// const A = ref({
//   manageCost:[5000, 6000],
//   hours:[8,4,8,4],
//   materialCost:700,
//   machineCost:100,
//   laborCost:200,
//   hourPay: [11,14,13,17],
//   hourRemain:[520,260,520,260],
//   machinePay:7.65
// })

export function produceCostCalc(config, plan){
  const res = []
  let acc = 0;
  // 原材料+机器成本
  for(let i=0; i<plan.length;i++){
    res.push(
      config.materialCost
      +config.machineCost*config.machinePay
      +config.laborCost*config.hourPay[i])
  }
  res.push(sumArray(plan)>0?sumProduct(res,plan)/sumArray(plan):res[0])
  return res;
}


function sumArray(arr) {
  return arr.reduce((acc, curr) => ~~acc + ~~curr, 0);
}

export function sumProduct(arr1, arr2) {
  // 检查数组是否为一维数组
  const isOneDimensional = arr => !Array.isArray(arr[0]);

  if (isOneDimensional(arr1) && isOneDimensional(arr2)) {
    // 如果都是一维数组，直接进行点乘并求和
    if (arr1.length !== arr2.length) {
      throw new Error('一维数组长度不匹配');
    }
    return arr1.reduce((acc, value, index) => acc + value * arr2[index], 0);
  } else if (!isOneDimensional(arr1) && !isOneDimensional(arr2)) {
    // 如果都是二维数组，进行矩阵相乘并求和
    if (arr1.length !== arr2.length || arr1[0].length !== arr2[0].length) {
      throw new Error('二维数组维度不匹配');
    }
    return arr1.reduce((acc, row, rowIndex) => {
      return acc + row.reduce((innerAcc, value, colIndex) => {
        return innerAcc + value * arr2[rowIndex][colIndex];
      }, 0);
    }, 0);
  } else {
    throw new Error('数组类型不匹配');
  }
}

export function sumColumns(matrix) {
  var result = [0, 0, 0, 0];

  for (var i = 0; i < matrix.length; i++) {
      for (var j = 0; j < matrix[i].length; j++) {
          result[j] += matrix[i][j];
      }
  }

  return result;
}

export function sumRows(matrix) {
  var result = [];

  for (var i = 0; i < matrix.length; i++) {
      var rowSum = 0;
      for (var j = 0; j < matrix[i].length; j++) {
          rowSum += matrix[i][j];
      }
      result.push(rowSum);
  }

  return result;
}