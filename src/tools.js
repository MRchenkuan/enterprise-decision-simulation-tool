import solver from 'javascript-lp-solver'

// 两个序列相除
export function divideSequence(d1,d2){
  if(!(d1&& d1.map)){
    return []
  }
  return d1.map((m1, id1)=>{
    const m2 = d2[id1];
    return divideMatrix(m1, m2);
  })
}

// 两个标签矩阵相除
export function divideMatrix(m1, m2) {
  const _m = {
    A:[],
    B:[],
    C:[],
    D:[]
  };
  Object.keys(m1).map(key=>{
    _m[key] = divideArrays(m1[key],m2[key])
  })
  return _m;
}

// 两个等长数组相除
export function divideArrays(m1,m2){
  let result = [0,0,0,0];
  for (let i = 0; i < m1.length; i++) {
    if(parseFloat(m1[i])===0 || parseFloat(m2[i])===0){
        result[i] = 0;
      } else {
        const _r = m1[i] / m2[i]
        result[i] = isNaN(_r)?0:_r;
      }
  }
  
  return result;
} 


export function timesMatrix(m1, m2) {
  const _m = {
    A:[],
    B:[],
    C:[],
    D:[]
  };
  Object.keys(m1).map(key=>{
    _m[key] = timesArrays(m1[key]||[],m2[key]||[])
  })
  return _m;
}

export function processMatrix(m1,processor){
  const _m = {
    A:[],
    B:[],
    C:[],
    D:[]
  }
  Object.keys(m1).map(key=>{
    _m[key] = m1[key].map(processor);
  })
  return _m;
}

export function processMatrixes(m1, m2, processor) {
  const _m = {
    A:[],
    B:[],
    C:[],
    D:[]
  }
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
  const _m = {
    A:[],
    B:[],
    C:[],
    D:[]
  }
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
    result.push(parseFloat(m1[i]) + parseFloat(m2[i]));
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
    result.push(~~m1[i] - ~~m2[i]);
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


export function produceCostCalc(config, plan){
  const res = []
  let acc = 0;
  // 原材料+机器成本
  for(let i=0; i<plan.length;i++){
    res.push(
      ~~config.materialCost
      +~~config.machineCost*config.machinePay
      +~~config.laborCost*config.hourPay[i])
  }
  res.push(sumArray(plan)>0?sumProduct(res,plan)/sumArray(plan):res[0])
  return res;
}


export function sumArray(arr) {
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
    return arr1.reduce((acc, value, index) => ~~acc + ~~value * arr2[index], 0);
  } else if (!isOneDimensional(arr1) && !isOneDimensional(arr2)) {
    // 如果都是二维数组，进行矩阵相乘并求和
    if (arr1.length !== arr2.length || arr1[0].length !== arr2[0].length) {
      throw new Error('二维数组维度不匹配');
    }
    return arr1.reduce((acc, row, rowIndex) => {
      return ~~acc + row.reduce((innerAcc, value, colIndex) => {
        return ~~innerAcc + ~~value * arr2[rowIndex][colIndex];
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
          result[j] += ~~matrix[i][j];
      }
  }

  return result;
}

export function sumRows(matrix) {
  var result = [];

  for (var i = 0; i < matrix.length; i++) {
      var rowSum = 0;
      for (var j = 0; j < matrix[i].length; j++) {
          rowSum += ~~matrix[i][j];
      }
      result.push(rowSum);
  }

  return result;
}

export function sum2DArray(arr, distanceOnly) {
  let totalSum = 0;
  for (let i = 0; i < arr.length; i++) {
      for (let j = 0; j < arr[i].length; j++) {
          totalSum += (!distanceOnly?~~arr[i][j]:Math.abs(~~arr[i][j]));
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

export function debounce(func, delay) {
  let timeoutId;
  
  return function(...args) {
      const context = this;
      
      clearTimeout(timeoutId);
      
      timeoutId = setTimeout(() => {
          func.apply(context, args);
      }, delay);
  };
}


export function createProductMarketDataset(HIS){
  const _datasets = []
  const map1 = ['A','B','C','D'];
  const map2 = ['1','2','3','4'];
  const colors = [
    ['#409EFF','#66b1ff','#3375b9','#2a598a'],
    ['#67C23A','#85ce61','#4e8e2f','#3e6b27'],
    ['#E6A23C','#ebb563','#a77730','#7d5b28'],
    ['#F56C6C','#f78989','#b25252','#854040'],
  ]
  const dates = {}
  
  // 将三维数据降维
  HIS.map((martrixM,periodId)=>{
    Object.keys(martrixM).map((key,productId)=>{
      const line = martrixM[key]
      line.map((cell, marketId)=>{
        if(!dates[`${productId}-${marketId}`])dates[`${productId}-${marketId}`] = [];
        dates[`${productId}-${marketId}`].push(cell) // 唯一市场唯一产品的数量
      })
    })
  })

  // 装载到图表数据
  map1.map((k1,i1)=>{
    map2.map((k2,i2)=>{
      _datasets.push({
        label: `${[map1[i1]]}-${[map2[i2]]}`,
        backgroundColor: colors[i1][i2],
        borderColor:colors[i1][i2],
        data:dates[`${i1}-${i2}`],
        // borderWidth:2,
        // pointRadius:2,
        // lineTension:0.1
      })
    })
  })
  return _datasets
}


export function formatNumberWithCommas(number) {
  // 转换成字符串形式
  let strNumber = String(number);
  // 正则表达式，匹配数字的千分位
  let regex = /(\d)(?=(\d{3})+(?!\d))/g;
  // 使用正则表达式替换
  return strNumber.replace(regex, "$1,");
}


export function formatNumber(number, places) {
  if (number < 1000) {
      return number.toString(); // 数字小于1000时直接返回原始数字
  } else if (number < 1000000) {
      return (number / 1000).toFixed(places) + 'k'; // 数字介于1000和1000000之间时，返回以k为单位的数字
  } else if (number < 1000000000) {
      return (number / 1000000).toFixed(places) + 'm'; // 数字介于1000000和1000000000之间时，返回以m为单位的数字
  } else {
      return (number / 1000000000).toFixed(places) + 'b'; // 数字大于等于1000000000时，返回以b为单位的数字
  }
}

export function colorClass(v){
  if(~~v<0){
    return 'bad'
  }
  if(~~v>0){
    return 'good'
  }
  if(~~v==0){
    return 'info'
  }
}

export function copyLastElement(data){
  if(data && data.length>0){
    return JSON.parse(JSON.stringify(data[data.length-1]))
  } else {
    return {}
  }
}


export function convertToNumber(str) {
  // 使用 isNaN() 函数检测是否为数字
  if (!isNaN(str)) {
    // 如果是数字，则转换为数字并返回
    return parseFloat(str);
    // 如果你需要整数，则可以使用 parseInt() 函数
    // return parseInt(str);
  }
  // 如果不是数字，则原样返回字符串
  return str;
}

export function checkMapStruct(obj) {
  if(!isObject(obj)) return false;
  // 检查对象是否具有四个键
  if (Object.keys(obj).length !== 4) {
    return false;
  }

  // 检查对象的每个键是否满足条件
  return Object.keys(obj).every(key => ['A', 'B', 'C', 'D'].includes(key) && Array.isArray(obj[key]));
}


export function newStructure(){
  return {
    A:[0,0,0,0],
    B:[0,0,0,0],
    C:[0,0,0,0],
    D:[0,0,0,0],
  }
}


export function cloneDeep(value, map = new WeakMap()) {
  if (!isObject(value)) {
    return value;
  }

  // 处理特殊对象类型
  if (value instanceof Date) {
    return new Date(value);
  }

  if (value instanceof RegExp) {
    return new RegExp(value.source, value.flags);
  }

  if (value instanceof Function) {
    return value;
  }

  // 避免循环引用
  if (map.has(value)) {
    return map.get(value);
  }

  // 初始化新对象
  const result = Array.isArray(value) ? [] : {};

  // 将新对象添加到 map 中
  map.set(value, result);

  // 递归复制属性
  for (let key in value) {
    if (Object.prototype.hasOwnProperty.call(value, key)) {
      result[key] = cloneDeep(value[key], map);
    }
  }

  return result;
}

// 检测是否为对象
function isObject(value) {
  return typeof value === 'object' && value !== null;
}


export function softMax(m){
  const sum = sum2DArray(Object.values(m), true);
  if(sum>0){
    Object.keys(m).map(key=>{
      for(let i=0;i<m[key].length;i++){
        m[key][i] = m[key][i]/sum
      }
    })
  }
  return m;
}

export function Max(m){
         
  if(sum>0){
    Object.keys(m).map(key=>{
      for(let i=0;i<m[key].length;i++){
        m[key][i] = m[key][i]/sum
      }
    })
  }
  return m;
}