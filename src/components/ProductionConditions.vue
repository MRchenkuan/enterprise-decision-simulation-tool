<script setup>

defineProps({
  msg: String,
  config: Object
})

</script>

<template>
  <div class="body">
    <el-form :model="config" label-width="auto" style="max-width: 600px" label-position="top">
      <div class="line">
        <el-text class="linetitle"></el-text>
        <el-text size="small" class="cell2">第一班</el-text>
        <el-text size="small" class="cell2">第二班</el-text>
      </div>
      <div class="line">
        <div class="linetitle"></div>
        <el-text size="small" class="cell4">正班1</el-text>
        <el-text size="small" class="cell4">加班1</el-text>
        <el-text size="small" class="cell4">正班2</el-text>
        <el-text size="small" class="cell4">加班2</el-text>
      </div>
      <div class="line">
        <el-text class="linetitle" size="small">管理费</el-text>
        <div class="cell2"><el-input v-model="config.manageCost[0]" size="small" class="input" /></div>
        <div class="cell2"><el-input v-model="config.manageCost[1]" size="small" class="input" /></div>
      </div>
      <div class="line">
        <el-text class="linetitle" size="small">当班最大工时</el-text>
        <div class="cell4"><el-input v-model="config.hours[0]" size="small" class="input" /></div>
        <div class="cell4"><el-input v-model="config.hours[1]" size="small" class="input" /></div>
        <div class="cell4"><el-input v-model="config.hours[2]" size="small" class="input" /></div>
        <div class="cell4"><el-input v-model="config.hours[3]" size="small" class="input" /></div>
      </div>
      <div class="line">
        <el-text class="linetitle" size="small">一个工时的成本</el-text>
        <div class="cell4"><el-input v-model="config.hourPay[0]" size="small" class="input" /></div>
        <div class="cell4"><el-input v-model="config.hourPay[1]" size="small" class="input" /></div>
        <div class="cell4"><el-input v-model="config.hourPay[2]" size="small" class="input" /></div>
        <div class="cell4"><el-input v-model="config.hourPay[3]" size="small" class="input" /></div>
      </div>
      <div class="line">
        <el-text class="linetitle" size="small">每期最大工时</el-text>
        <div class="cell4"><el-input v-model="config.hourRemain[0]" size="small" class="input" /></div>
        <div class="cell4"><el-input v-model="config.hourRemain[1]" size="small" class="input" /></div>
        <div class="cell4"><el-input v-model="config.hourRemain[2]" size="small" class="input" /></div>
        <div class="cell4"><el-input v-model="config.hourRemain[3]" size="small" class="input" /></div>
      </div>
      <div class="line">
        <el-text class="linetitle" size="small">原材料消耗/件</el-text>
        <div class="cell1"><el-input v-model="config.materialCost" size="small" style="text-align: center;" class="input" /></div>
      </div>
      <div class="line">
        <el-text class="linetitle" size="small">机器消耗/件</el-text>
        <div class="cell1"><el-input v-model="config.machineCost" size="small" class="input" /></div>
      </div>
      <div class="line">
        <el-text class="linetitle" size="small">人力消耗/件</el-text>
        <div class="cell1"><el-input v-model="config.laborCost" size="small" class="input" /></div>
      </div>
      <div class="line">
        <el-text class="linetitle" size="small">一个机时的成本</el-text>
        <div class="cell1"><el-input v-model="config.machinePay" size="small" class="input" /></div>
      </div>
    </el-form>
  </div>  
</template>

<style scoped>
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
  width: 130px;
  margin: 0 18px 0 0 ;
  text-align: right;    
}

.line .input{
  margin: 5px;
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
