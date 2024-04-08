import { ref, watchEffect } from 'vue';
export function PowerRef(key, obj){
  // return ref(obj)
  const target = retrieveValue(key);
  let result = target ? ref(target):ref(obj)
  watchEffect(()=>{
    storeValue(key, result.value)
  })
  return result
}

// 将任意类型的值存储到本地存储
function storeValue(key, value) {
  try {
      // 确定值的数据类型并存储
      if (typeof value === 'object') {
          localStorage.setItem(key, JSON.stringify(value));
      } else {
          localStorage.setItem(key, value.toString());
      }
  } catch (error) {
      console.error("Error storing value:", error);
  }
}

// 从本地存储中检索值
function retrieveValue(key) {
  try {
      const storedValue = localStorage.getItem(key);
      // 尝试解析为JSON，如果失败，则返回原始字符串
      try {
          return JSON.parse(storedValue);
      } catch (parseError) {
          return storedValue;
      }
  } catch (error) {
      console.error("Error retrieving value:", error);
      return null;
  }
}