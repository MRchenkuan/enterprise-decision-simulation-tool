<script setup>
import { ref,watch, defineEmits } from "vue"
import { roundToDecimal } from "../tools";


const props = defineProps({
  controls: Boolean,
  value:Number|String,
  step:Number,
  formater:Function,
  parser:Function,
  size:String,
  type:String,
  places:Number,
})

const emit = defineEmits(['update:value']);

const innerValue = ref(props.value);
// const innerValue = ref(roundDecimal(props.value));

watch(innerValue,(newInnerValue)=>{
  emit('update:value', newInnerValue);
})

// todo 在PowerInput中实现小数点舍入未生效，后续补
function roundDecimal(v){
  return roundToDecimal(~~v,props.places);
}

</script>

<template>
  <!-- <el-popover v-if="type==='number'" 
    placement="top"
    :width="150"
    trigger="click"
  >
    <template #reference>
      <el-input-number
        style="width: auto;"
        :controls="controls" 
        :step="step" 
        v-model="innerValue" 
        :size="size" 
      />
    </template>
    <el-slider :step="10" :size="size" v-model="innerValue" :min="(100-~~innerValue)*2" :max="(~~innerValue+100)*2" />
  </el-popover> -->
  <el-input-number v-if="type==='number'" 
    style="width: auto;"
    :controls="controls"
    :class="{controls}"
    :step="step" 
    v-model="innerValue" 
    :size="size"
  />
  <el-input v-else 
    :controls="controls" 
    v-model="innerValue" 
    :formatter="formater" 
    :parser="parser" 
    :size="size" 
  />
</template>

<style scoped>
  .controls{
    padding: 0;
  }
</style>
