import solver from 'javascript-lp-solver'

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


export function sum2DArray(arr) {
  let totalSum = 0;
  for (let i = 0; i < arr.length; i++) {
      for (let j = 0; j < arr[i].length; j++) {
          totalSum += arr[i][j];
      }
  }
  return totalSum;
}

export function autoUnit(num) {
  if (num < 10000) {
      return num.toString();
  } else if (num < 100000000) {
      return (num / 10000).toFixed(1) + "万";
  } else {
      return (num / 100000000).toFixed(1) + "亿";
  }
}



export function maximizeXValuesWithLP(r1, r2, r3, r4, maxLR, maxMR) {
// 待求解的数组
var variables = {
  X1: "X1",
  X2: "X2",
  X3: "X3",
  X4: "X4"
};


// 定义变量
var c1 = "(1+" + r1 + ")*" + variables.X1;
var c2 = "(1+" + r2 + ")*" + variables.X2;
var c3 = "(1+" + r3 + ")*" + variables.X3;
var c4 = "(1+" + r4 + ")*" + variables.X4;

// LR = Max(c1, c2)+Max(c3,c4)
var LR = "LR";
var constraints_LR = {
  "c1": 1,
  "c2": 1,
  "c3": 1,
  "c4": 1
};

var constraint_LR = {
  "max": maxLR,
  "min": 0
};

// MR = Max(c1, c2+c3, c4)
var MR = "MR";
var constraints_MR = {
  "c1": 1,
  "c2": 1,
  "c3": 1,
  "c4": 1
};

var constraint_MR = {
  "max": maxMR,
  "min": 0
};

// 定义目标函数
var objective = {};
objective[variables.X1] = 1;
objective[variables.X2] = 1;
objective[variables.X3] = 1;
objective[variables.X4] = 1;

// 定义约束
var constraints = {};
constraints[variables.X1] = { "min": 0 };
constraints[variables.X2] = { "min": 0 };
constraints[variables.X3] = { "min": 0 };
constraints[variables.X4] = { "min": 0 };

constraints[c1] = { "max": c2 };
constraints[c3] = { "max": c4 };
constraints[LR] = constraint_LR;
constraints[MR] = constraint_MR;

// 定义问题
var model = {
  "optimize": "profit",
  "opType": "linear",
  "constraints": constraints,
  "variables": objective
};

// 求解问题
  return solver.Solve(model);
}

// 梯度下降算法
export function gradientDescent(learningRate, maxIterations, tolerance, h, targetFun) {

  // 数值微分来计算梯度
  function numericalGradient(x1, x2, x3, x4, h) {
    const point = targetFun(x1, x2, x3, x4);
    if(point== 'OVERFLOW')return [0,0,0,0]
    const d1 = targetFun(x1 + h, x2, x3, x4);
    const d2 = targetFun(x1, x2 + h, x3, x4);
    const d3 = targetFun(x1, x2, x3 + h, x4);
    const d4 = targetFun(x1, x2, x3, x4 + h);
    //当某一维度到达边界则速度减慢一半反向
    return [
      (d1!= 'OVERFLOW')? ((d1-point) / h):-0.75*h,
      (d2!= 'OVERFLOW')? ((d2-point) / h):-0.75*h,
      (d3!= 'OVERFLOW')? ((d3-point) / h):-0.75*h,
      (d4!= 'OVERFLOW')? ((d4-point) / h):-0.75*h
    ];
  }

  let x = [0, 0, 0, 0]; // 初始值
  let iter = 0;
  while (iter < maxIterations) {
      let grad = numericalGradient(x[0], x[1], x[2], x[3], h);
      let prevX = x.slice();
      for (let i = 0; i < x.length; i++) {
          x[i] += learningRate * grad[i];
      }
      let diff = 0;
      for (let i = 0; i < x.length; i++) {
          diff += Math.abs(x[i] - prevX[i]);
      }
      if (diff < tolerance) {
        break;
      }
      iter++;
      console.log(iter+'轮迭代结束:',x)
  }
  return x;
}

export function softMax(a, b) {
  // 平滑处理Math.max 便于求导
  // return Math.log(Math.exp(a) + Math.exp(b));
  return Math.max(a,b)
}