<script setup>
import { ref,watch, watchEffect } from 'vue'
import { formatAsPercentage, parsePercentage, roundToDecimal } from '../tools';
import PowerInput from './PowerInput.vue';
const props = defineProps({
  config: {
    type:Object,
    default:{
      A:[],
      B:[],
      C:[],
      D:[]
    }
  },
  readonly:Boolean,
  unit:String,
  colored:{
    type: String,
    default: ""
  },
  colored2:{
    type: String,
    default: ""
  },
  type:String,
  extra:Array,
  extra2:Array,
  extraReadonly:Boolean,
  extraEditable:Boolean,
  places:Number,
  inputType:{
    type:String,
    default:"number"
  },
  controls:Boolean,
  step:Number,
  disabled:Boolean
})

const normalConfig=ref({
  A:[0,0,0,0],
  B:[0,0,0,0],
  C:[0,0,0,0],
  D:[0,0,0,0],
});

watchEffect(()=>{
  const entites = Object.keys(props.config);
  const memberStructWrong = entites.some(key=>{
    return !props.config[key]
  })
  if(entites.length!=4 || memberStructWrong){
    normalConfig.value = {
      A:[0,0,0,0],
      B:[0,0,0,0],
      C:[0,0,0,0],
      D:[0,0,0,0],
    } 
    // props.extra = [0,0,0,0];
  } else {
    normalConfig.value = props.config;
  }
});
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
  if(colored ==='info'){
    return 'info'
  }
  return props.colored ? {
    'good':v>0,
    'bad':v<0,
  }:'default'
}
const colored2 = props.colored2;
function colorClass2(v){
  if(colored2 ==='bad'){
    return 'bad'
  }
  if(colored2 ==='good'){
    return 'good'
  }
  if(colored2 ==='info'){
    return 'info'
  }
  return props.colored2 ? {
    'good':v>0,
    'bad':v<0,
  }:'default'
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
      <div class="cell4"><el-text size="small" :class="colorClass(normalConfig.A[0])">{{ roundPercent(normalConfig.A[0]) }}</el-text></div>
      <div class="cell4"><el-text size="small" :class="colorClass(normalConfig.A[1])">{{ roundPercent(normalConfig.A[1]) }}</el-text></div>
      <div class="cell4"><el-text size="small" :class="colorClass(normalConfig.A[2])">{{ roundPercent(normalConfig.A[2]) }}</el-text></div>
      <div class="cell4"><el-text size="small" :class="colorClass(normalConfig.A[3])">{{ roundPercent(normalConfig.A[3]) }}</el-text></div>
      <div v-if="extra&&extraEditable" class="cell4"><power-input :disabled="disabled" :places="places" :type="inputType" :controls="controls" controls-position="right" :step="step" v-model="extra[0]" :formatter="formater" :parser="parser" size="small" class="input" /></div>
      <div v-else-if="extra" class="cell4"><el-text size="small" :class="colorClass2(extra[0])">{{ roundPercent(extra[0]) }}</el-text></div>
    </div>
    <div class="line">
      <el-text class="linetitle" size="small">产品B</el-text>
      <div class="cell4"><el-text size="small" :class="colorClass(normalConfig.B[0])">{{ roundPercent(normalConfig.B[0]) }}</el-text></div>
      <div class="cell4"><el-text size="small" :class="colorClass(normalConfig.B[1])">{{ roundPercent(normalConfig.B[1]) }}</el-text></div>
      <div class="cell4"><el-text size="small" :class="colorClass(normalConfig.B[2])">{{ roundPercent(normalConfig.B[2]) }}</el-text></div>
      <div class="cell4"><el-text size="small" :class="colorClass(normalConfig.B[3])">{{ roundPercent(normalConfig.B[3]) }}</el-text></div>
      <div v-if="extra&&extraEditable" class="cell4"><power-input :disabled="disabled" :places="places" :type="inputType" :controls="controls" controls-position="right" :step="step" v-model="extra[1]" :formatter="formater" :parser="parser" size="small" class="input" /></div>
      <div v-else-if="extra" class="cell4"><el-text size="small" :class="colorClass2(extra[1])">{{ roundPercent(extra[1]) }}</el-text></div>
    </div>
    <div class="line">
      <el-text class="linetitle" size="small">产品C</el-text>
      <div class="cell4"><el-text size="small" :class="colorClass(normalConfig.C[0])">{{ roundPercent(normalConfig.C[0]) }}</el-text></div>
      <div class="cell4"><el-text size="small" :class="colorClass(normalConfig.C[1])">{{ roundPercent(normalConfig.C[1]) }}</el-text></div>
      <div class="cell4"><el-text size="small" :class="colorClass(normalConfig.C[2])">{{ roundPercent(normalConfig.C[2]) }}</el-text></div>
      <div class="cell4"><el-text size="small" :class="colorClass(normalConfig.C[3])">{{ roundPercent(normalConfig.C[3]) }}</el-text></div>
      <div v-if="extra&&extraEditable" class="cell4"><power-input :disabled="disabled" :places="places" :type="inputType" :controls="controls" controls-position="right" :step="step" v-model="extra[2]" :formatter="formater" :parser="parser" size="small" class="input" /></div>
      <div v-else-if="extra" class="cell4"><el-text size="small" :class="colorClass2(extra[2])">{{ roundPercent(extra[2]) }}</el-text></div>
    </div>
    <div class="line">
      <el-text class="linetitle" size="small">产品D</el-text>
      <div class="cell4"><el-text size="small" :class="colorClass(normalConfig.D[0])">{{ roundPercent(normalConfig.D[0]) }}</el-text></div>
      <div class="cell4"><el-text size="small" :class="colorClass(normalConfig.D[1])">{{ roundPercent(normalConfig.D[1]) }}</el-text></div>
      <div class="cell4"><el-text size="small" :class="colorClass(normalConfig.D[2])">{{ roundPercent(normalConfig.D[2]) }}</el-text></div>
      <div class="cell4"><el-text size="small" :class="colorClass(normalConfig.D[3])">{{ roundPercent(normalConfig.D[3]) }}</el-text></div>
      <div v-if="extra&&extraEditable" class="cell4"><power-input :disabled="disabled" :places="places" :type="inputType" :controls="controls" controls-position="right" :step="step" v-model="extra[3]" :formatter="formater" :parser="parser" size="small" class="input" /></div>
      <div v-else-if="extra" class="cell4"><el-text size="small" :class="colorClass2(extra[3])">{{ roundPercent(extra[3]) }}</el-text></div>
    </div>
    <div class="line" v-if="extra2">
      <el-text class="linetitle" size="small">汇总</el-text>
      <div class="cell4"><el-text size="small" :class="colorClass(extra2[0])">{{ roundPercent(extra2[0]) }}</el-text></div>
      <div class="cell4"><el-text size="small" :class="colorClass(extra2[1])">{{ roundPercent(extra2[1]) }}</el-text></div>
      <div class="cell4"><el-text size="small" :class="colorClass(extra2[2])">{{ roundPercent(extra2[2]) }}</el-text></div>
      <div class="cell4"><el-text size="small" :class="colorClass(extra2[3])">{{ roundPercent(extra2[3]) }}</el-text></div>
      <div v-if="extra&&extraEditable" class="cell4"><power-input :disabled="disabled" :places="places" :type="inputType" :controls="controls" controls-position="right" :step="step" v-model="extra[4]" :formatter="formater" :parser="parser" size="small" class="input" /></div>
      <div v-else-if="extra" class="cell4"><el-text size="small" :class="colorClass2(extra[4])">{{ roundPercent(extra[4]) }}</el-text></div>
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
      <div class="cell4"><power-input :disabled="disabled" :places="places" :type="inputType" :controls="controls" controls-position="right" :step="step" v-model="normalConfig.A[0]" :formatter="formater" :parser="parser" size="small" class="input" /></div>
      <div class="cell4"><power-input :disabled="disabled" :places="places" :type="inputType" :controls="controls" controls-position="right" :step="step" v-model="normalConfig.A[1]" :formatter="formater" :parser="parser" size="small" class="input" /></div>
      <div class="cell4"><power-input :disabled="disabled" :places="places" :type="inputType" :controls="controls" controls-position="right" :step="step" v-model="normalConfig.A[2]" :formatter="formater" :parser="parser" size="small" class="input" /></div>
      <div class="cell4"><power-input :disabled="disabled" :places="places" :type="inputType" :controls="controls" controls-position="right" :step="step" v-model="normalConfig.A[3]" :formatter="formater" :parser="parser" size="small" class="input" /></div>
      <div v-if="extra&&extraReadonly" class="cell4"><el-text size="small" :class="colorClass2(extra[0])">{{ roundPercent(extra[0]) }}</el-text></div>
      <div v-else-if="extra" class="cell4"><power-input :disabled="disabled" :places="places" :type="inputType" :controls="controls" controls-position="right" :step="step" v-model="extra[0]" :formatter="formater" :parser="parser" size="small" class="input" /></div>
    </div>
    <div class="line">
      <el-text class="linetitle" size="small">产品B</el-text>
      <div class="cell4"><power-input :disabled="disabled" :places="places" :type="inputType" :controls="controls" controls-position="right" :step="step" v-model="normalConfig.B[0]" :formatter="formater" :parser="parser" size="small" class="input" /></div>
      <div class="cell4"><power-input :disabled="disabled" :places="places" :type="inputType" :controls="controls" controls-position="right" :step="step" v-model="normalConfig.B[1]" :formatter="formater" :parser="parser" size="small" class="input" /></div>
      <div class="cell4"><power-input :disabled="disabled" :places="places" :type="inputType" :controls="controls" controls-position="right" :step="step" v-model="normalConfig.B[2]" :formatter="formater" :parser="parser" size="small" class="input" /></div>
      <div class="cell4"><power-input :disabled="disabled" :places="places" :type="inputType" :controls="controls" controls-position="right" :step="step" v-model="normalConfig.B[3]" :formatter="formater" :parser="parser" size="small" class="input" /></div>
      <div v-if="extra&&extraReadonly" class="cell4"><el-text size="small" :class="colorClass2(extra[1])">{{ roundPercent(extra[1]) }}</el-text></div>
      <div v-else-if="extra" class="cell4"><power-input :disabled="disabled" :places="places" :type="inputType" :controls="controls" controls-position="right" :step="step" v-model="extra[1]" :formatter="formater" :parser="parser" size="small" class="input" /></div>    </div>
    <div class="line">
      <el-text class="linetitle" size="small">产品C</el-text>
      <div class="cell4"><power-input :disabled="disabled" :places="places" :type="inputType" :controls="controls" controls-position="right" :step="step" v-model="normalConfig.C[0]" :formatter="formater" :parser="parser" size="small" class="input" /></div>
      <div class="cell4"><power-input :disabled="disabled" :places="places" :type="inputType" :controls="controls" controls-position="right" :step="step" v-model="normalConfig.C[1]" :formatter="formater" :parser="parser" size="small" class="input" /></div>
      <div class="cell4"><power-input :disabled="disabled" :places="places" :type="inputType" :controls="controls" controls-position="right" :step="step" v-model="normalConfig.C[2]" :formatter="formater" :parser="parser" size="small" class="input" /></div>
      <div class="cell4"><power-input :disabled="disabled" :places="places" :type="inputType" :controls="controls" controls-position="right" :step="step" v-model="normalConfig.C[3]" :formatter="formater" :parser="parser" size="small" class="input" /></div>
      <div v-if="extra&&extraReadonly" class="cell4"><el-text size="small" :class="colorClass2(extra[2])">{{ roundPercent(extra[2]) }}</el-text></div>
      <div v-else-if="extra" class="cell4"><power-input :disabled="disabled" :places="places" :type="inputType" :controls="controls" controls-position="right" :step="step" v-model="extra[2]" :formatter="formater" :parser="parser" size="small" class="input" /></div>
    </div>
    <div class="line">
      <el-text class="linetitle" size="small">产品D</el-text>
      <div class="cell4"><power-input :disabled="disabled" :places="places" :type="inputType" :controls="controls" controls-position="right" :step="step" v-model="normalConfig.D[0]" :formatter="formater" :parser="parser" size="small" class="input" /></div>
      <div class="cell4"><power-input :disabled="disabled" :places="places" :type="inputType" :controls="controls" controls-position="right" :step="step" v-model="normalConfig.D[1]" :formatter="formater" :parser="parser" size="small" class="input" /></div>
      <div class="cell4"><power-input :disabled="disabled" :places="places" :type="inputType" :controls="controls" controls-position="right" :step="step" v-model="normalConfig.D[2]" :formatter="formater" :parser="parser" size="small" class="input" /></div>
      <div class="cell4"><power-input :disabled="disabled" :places="places" :type="inputType" :controls="controls" controls-position="right" :step="step" v-model="normalConfig.D[3]" :formatter="formater" :parser="parser" size="small" class="input" /></div>
      <div v-if="extra&&extraReadonly" class="cell4"><el-text size="small" :class="colorClass2(extra[3])">{{ roundPercent(extra[3]) }}</el-text></div>
      <div v-else-if="extra" class="cell4"><power-input :disabled="disabled" :places="places" :type="inputType" :controls="controls" controls-position="right" :step="step" v-model="extra[3]" :formatter="formater" :parser="parser" size="small" class="input" /></div>    </div>
    <div class="line" v-if="extra2">
      <el-text class="linetitle" size="small">产品D</el-text>
      <div class="cell4"><power-input :disabled="disabled" :places="places" :type="inputType" :controls="controls" controls-position="right" :step="step" v-model="extra2[0]" :formatter="formater" :parser="parser" size="small" class="input" /></div>
      <div class="cell4"><power-input :disabled="disabled" :places="places" :type="inputType" :controls="controls" controls-position="right" :step="step" v-model="extra2[1]" :formatter="formater" :parser="parser" size="small" class="input" /></div>
      <div class="cell4"><power-input :disabled="disabled" :places="places" :type="inputType" :controls="controls" controls-position="right" :step="step" v-model="extra2[2]" :formatter="formater" :parser="parser" size="small" class="input" /></div>
      <div class="cell4"><power-input :disabled="disabled" :places="places" :type="inputType" :controls="controls" controls-position="right" :step="step" v-model="extra2[3]" :formatter="formater" :parser="parser" size="small" class="input" /></div>
      <div v-if="extra&&extraReadonly" class="cell4"><el-text size="small" :class="colorClass2(extra[4])">{{ roundPercent(extra[4]) }}</el-text></div>
      <div v-else-if="extra" class="cell4"><power-input :disabled="disabled" :places="places" :type="inputType" :controls="controls" controls-position="right" :step="step" v-model="extra[4]" :formatter="formater" :parser="parser" size="small" class="input" /></div>    </div>
  </div>
</template>

<style scoped>
.readonly{
  /* background: #eeeeee; */
  font-weight: 900;
}
.default{
  font-weight: 900;
}
.good{
  color: #67C23A;
  font-weight: 900;
}
.info{
  color: #409EFF;
  font-weight: 900;
}
.bad{
  color: #F56C6C;
  font-weight: 900;
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
  border: 1px solid #eee;
  display: flex;
  box-sizing: border-box;
  justify-content: center;
  align-items: center;
  line-height: 2;
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
