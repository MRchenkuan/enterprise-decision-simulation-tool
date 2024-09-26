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
  diff: {
    type:Object,
    default:{
      A:[],
      B:[],
      C:[],
      D:[]
    }
  },
  diffextra:Array,
  diffunit:String,
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
  extraReadonly:{
    default:true
  },
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
  <div class="frame">
    <div class="line">
      <el-text class="linetitle" size="small"></el-text>
      <template v-for="item in type==='produce'? ['正班1','加班1','正班2','加班2',extra?'平均':undefined]:['市场1','市场2','市场3','市场4',extra?'汇总':undefined]"      >
        <el-text 
          v-if="item"
          size="small" 
          class="cell4" 
          :key="item">
            {{item}}
        </el-text>
      </template>
    </div>
    <div class="line" v-for="(line,line_idx) in ['A','B','C','D']" :key="line_idx">
      <el-text class="linetitle" size="small">产品{{ line }}</el-text>
      <template v-for="(cell,cell_idx) in normalConfig[line]" :key="cell_idx">
        <div class="cell4" v-if="cell_idx < 4">
          <template v-if="readonly">
            <el-text 
              size="small" 
              :class="colorClass(cell)">
              {{ roundPercent(cell) }}
            </el-text>
            <el-text v-if="diff[line][cell_idx]" class="diff_tips" size="small" :type="diff[line][cell_idx]>0?'success':'danger'">
              {{ diff[line][cell_idx]>0?"↑":"↓" }} {{ diff[line][cell_idx] }}{{ diffunit }}
            </el-text>
          </template>
          <power-input v-else 
            :disabled="disabled" 
            :places="places" 
            :type="inputType" 
            :controls="controls" 
            controls-position="right" 
            :step="step" 
            v-model="normalConfig[line][cell_idx]" 
            :formatter="formater" 
            :parser="parser"
            size="small" 
            class="input" />
        </div>
      </template>
      <div v-if="extra&&!extraReadonly" class="cell4">
        <power-input 
          :disabled="disabled" 
          :places="places" 
          :type="inputType" 
          :controls="controls" 
          controls-position="right" 
          :step="step" 
          v-model="extra[line_idx]" 
          :formatter="formater" 
          :parser="parser" 
          size="small" 
          class="input" 
          />
        </div>
      <div v-else-if="extra" class="cell4">
        <el-text size="small" :class="colorClass2(extra[line_idx])">{{ roundPercent(extra[line_idx]) }}</el-text>
        <el-text v-if="diffextra && diffextra[line_idx]" class="diff_tips" size="small" :type="diffextra[line_idx]>0?'success':'danger'">
          {{ diffextra[line_idx]>0?"↑":"↓" }}{{ diffextra[line_idx] }}
        </el-text>
      </div>
    </div>
  </div>
  
</template>

<style scoped>
.diff_tips{
  position: absolute;
  right: -5px;
  top: -8px;
  z-index: 99999;
  transform: scale(0.75);
  font-weight: normal;
}
.frame{
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
  position: relative;
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
