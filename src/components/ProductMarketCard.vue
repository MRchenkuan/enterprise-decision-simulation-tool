<script setup>
import { ref } from 'vue'
import { formatAsPercentage, parsePercentage, roundToDecimal } from '../tools';

const props = defineProps({
  config: Object,
  readonly:Boolean,
  unit:String,
  colored:{
    type: String,
    default: ""
  },
  type:String,
  extra:Array,
  places:Number
})

// 定义一个响应式引用来存储输入框的值
const percentage = ref('');


const formater = props.unit==='%' ? formatAsPercentage:null;
const parser = props.unit==='%' ? parsePercentage:null;

function roundPercent(v){
  return props.unit==='%' ? roundToDecimal(v*100, props.places)+'%': roundToDecimal(v,props.places);
}
const colored = props.colored;
function colorClass(v){
  if(colored ==='bad'){
    return 'bad'
  }
  if(colored ==='good'){
    return 'good'
  }
  return props.colored ? {
    'good':v>0,
    'bad':v<0,
  }:null
}

</script>

<template>
  <div v-if="readonly" class="readonly">
    <div class="line">
      <el-text class="linetitle" size="small"></el-text>
      <template v-if="type==='produce'">
        <el-text size="small" class="cell4">正班1</el-text>
        <el-text size="small" class="cell4">加班1</el-text>
        <el-text size="small" class="cell4">正班2</el-text>
        <el-text size="small" class="cell4">加班2</el-text>
      </template>
      <template v-else>
        <el-text size="small" class="cell4">市场1</el-text>
        <el-text size="small" class="cell4">市场2</el-text>
        <el-text size="small" class="cell4">市场3</el-text>
        <el-text size="small" class="cell4">市场4</el-text>
      </template>
      <el-text v-if="extra" size="small" class="cell4">汇总</el-text>
    </div>
    <div class="line">
      <el-text class="linetitle" size="small">产品A</el-text>
      <div class="cell4"><el-text size="small" :class="colorClass(config.A[0])">{{ roundPercent(config.A[0]) }}</el-text></div>
      <div class="cell4"><el-text size="small" :class="colorClass(config.A[1])">{{ roundPercent(config.A[1]) }}</el-text></div>
      <div class="cell4"><el-text size="small" :class="colorClass(config.A[2])">{{ roundPercent(config.A[2]) }}</el-text></div>
      <div class="cell4"><el-text size="small" :class="colorClass(config.A[3])">{{ roundPercent(config.A[3]) }}</el-text></div>
      <div v-if="extra" class="cell4"><el-text size="small" :class="colorClass(extra[0])">{{ roundPercent(extra[0]) }}</el-text></div>
    </div>
    <div class="line">
      <el-text class="linetitle" size="small">产品B</el-text>
      <div class="cell4"><el-text size="small" :class="colorClass(config.B[0])">{{ roundPercent(config.B[0]) }}</el-text></div>
      <div class="cell4"><el-text size="small" :class="colorClass(config.B[1])">{{ roundPercent(config.B[1]) }}</el-text></div>
      <div class="cell4"><el-text size="small" :class="colorClass(config.B[2])">{{ roundPercent(config.B[2]) }}</el-text></div>
      <div class="cell4"><el-text size="small" :class="colorClass(config.B[3])">{{ roundPercent(config.B[3]) }}</el-text></div>
      <div v-if="extra" class="cell4"><el-text size="small" :class="colorClass(extra[1])">{{ roundPercent(extra[1]) }}</el-text></div>
    </div>
    <div class="line">
      <el-text class="linetitle" size="small">产品C</el-text>
      <div class="cell4"><el-text size="small" :class="colorClass(config.C[0])">{{ roundPercent(config.C[0]) }}</el-text></div>
      <div class="cell4"><el-text size="small" :class="colorClass(config.C[1])">{{ roundPercent(config.C[1]) }}</el-text></div>
      <div class="cell4"><el-text size="small" :class="colorClass(config.C[2])">{{ roundPercent(config.C[2]) }}</el-text></div>
      <div class="cell4"><el-text size="small" :class="colorClass(config.C[3])">{{ roundPercent(config.C[3]) }}</el-text></div>
      <div v-if="extra" class="cell4"><el-text size="small" :class="colorClass(extra[2])">{{ roundPercent(extra[2]) }}</el-text></div>
    </div>
    <div class="line">
      <el-text class="linetitle" size="small">产品D</el-text>
      <div class="cell4"><el-text size="small" :class="colorClass(config.D[0])">{{ roundPercent(config.D[0]) }}</el-text></div>
      <div class="cell4"><el-text size="small" :class="colorClass(config.D[1])">{{ roundPercent(config.D[1]) }}</el-text></div>
      <div class="cell4"><el-text size="small" :class="colorClass(config.D[2])">{{ roundPercent(config.D[2]) }}</el-text></div>
      <div class="cell4"><el-text size="small" :class="colorClass(config.D[3])">{{ roundPercent(config.D[3]) }}</el-text></div>
      <div v-if="extra" class="cell4"><el-text size="small" :class="colorClass(extra[3])">{{ roundPercent(extra[3]) }}</el-text></div>
    </div>
  </div>
  <div v-else>
    <div class="line">
      <el-text class="linetitle" size="small"></el-text>
      <template v-if="type==='produce'">
        <el-text size="small" class="cell4">正班1</el-text>
        <el-text size="small" class="cell4">加班1</el-text>
        <el-text size="small" class="cell4">正班2</el-text>
        <el-text size="small" class="cell4">加班2</el-text>
      </template>
      <template v-else>
        <el-text size="small" class="cell4">市场1</el-text>
        <el-text size="small" class="cell4">市场2</el-text>
        <el-text size="small" class="cell4">市场3</el-text>
        <el-text size="small" class="cell4">市场4</el-text>
      </template>
      <el-text v-if="extra" size="small" class="cell4">汇总</el-text>
    </div>
    <div class="line">
      <el-text class="linetitle" size="small">产品A</el-text>
      <div class="cell4"><el-input v-model="config.A[0]" :formatter="formater" :parser="parser" size="small" class="input" /></div>
      <div class="cell4"><el-input v-model="config.A[1]" :formatter="formater" :parser="parser" size="small" class="input" /></div>
      <div class="cell4"><el-input v-model="config.A[2]" :formatter="formater" :parser="parser" size="small" class="input" /></div>
      <div class="cell4"><el-input v-model="config.A[3]" :formatter="formater" :parser="parser" size="small" class="input" /></div>
      <div v-if="extra" class="cell4"><el-input v-model="extra[0]" :formatter="formater" :parser="parser" size="small" class="input" /></div>
    </div>
    <div class="line">
      <el-text class="linetitle" size="small">产品B</el-text>
      <div class="cell4"><el-input v-model="config.B[0]" :formatter="formater" :parser="parser" size="small" class="input" /></div>
      <div class="cell4"><el-input v-model="config.B[1]" :formatter="formater" :parser="parser" size="small" class="input" /></div>
      <div class="cell4"><el-input v-model="config.B[2]" :formatter="formater" :parser="parser" size="small" class="input" /></div>
      <div class="cell4"><el-input v-model="config.B[3]" :formatter="formater" :parser="parser" size="small" class="input" /></div>
      <div v-if="extra" class="cell4"><el-input v-model="extra[1]" :formatter="formater" :parser="parser" size="small" class="input" /></div>
    </div>
    <div class="line">
      <el-text class="linetitle" size="small">产品C</el-text>
      <div class="cell4"><el-input v-model="config.C[0]" :formatter="formater" :parser="parser" size="small" class="input" /></div>
      <div class="cell4"><el-input v-model="config.C[1]" :formatter="formater" :parser="parser" size="small" class="input" /></div>
      <div class="cell4"><el-input v-model="config.C[2]" :formatter="formater" :parser="parser" size="small" class="input" /></div>
      <div class="cell4"><el-input v-model="config.C[3]" :formatter="formater" :parser="parser" size="small" class="input" /></div>
      <div v-if="extra" class="cell4"><el-input v-model="extra[2]" :formatter="formater" :parser="parser" size="small" class="input" /></div>

    </div>
    <div class="line">
      <el-text class="linetitle" size="small">产品D</el-text>
      <div class="cell4"><el-input v-model="config.D[0]" :formatter="formater" :parser="parser" size="small" class="input" /></div>
      <div class="cell4"><el-input v-model="config.D[1]" :formatter="formater" :parser="parser" size="small" class="input" /></div>
      <div class="cell4"><el-input v-model="config.D[2]" :formatter="formater" :parser="parser" size="small" class="input" /></div>
      <div class="cell4"><el-input v-model="config.D[3]" :formatter="formater" :parser="parser" size="small" class="input" /></div>
      <div v-if="extra" class="cell4"><el-input v-model="extra[3]" :formatter="formater" :parser="parser" size="small" class="input" /></div>
    </div>
  </div>
</template>

<style scoped>
.readonly{
  /* background: #eeeeee; */
  font-weight: 900;
}
.good{
  color: #67C23A;
}
.bad{
  color: #F56C6C;
}
.line{
  display: flex;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
}

.line .cell1{
  border: 1px solid #eee;
  width: 100%;
  box-sizing: border-box;
}

.line .cell2{
  border: 1px solid #eee;
  width: 50%;
  box-sizing: border-box;
}

.line .cell4{
  border: 1px solid #eee;
  width: 25%;
  box-sizing: border-box;
}


.line>.linetitle{
  width: 60px;
  margin: 0 18px 0 0 ;
  text-align: right;    
}

.line .input{
  margin: 0px;
  width: auto;
  display: flex;
  text-align: center;
}

.demo-tabs > .el-tabs__content {
  padding: 32px;
  color: #6b778c;
  font-size: 32px;
  font-weight: 600;
  background: white;
}
.panel{
  background-color: white;
}
</style>
