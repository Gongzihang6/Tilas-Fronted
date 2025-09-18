<!-- views/StatsDashboard.vue -->
<template>
  <div>
    <el-row :gutter="20">
      <el-col :span="12">
        <el-card>
          <template #header>员工性别比例</template>
          <!-- 1. 性别比例饼图的容器 -->
          <div ref="genderChart" style="width: 100%; height: 400px;"></div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card>
          <template #header>各职位平均工资</template>
          <!-- 2. 职位平均工资柱状图的容器 -->
          <div ref="jobSalaryChart" style="width: 100%; height: 400px;"></div>
        </el-card>
      </el-col>
    </el-row>
    <el-row style="margin-top: 20px;">
      <el-col :span="24">
        <el-card>
          <template #header>各部门平均工资</template>
          <!-- 3. 部门平均工资柱状图的容器 -->
          <div ref="deptSalaryChart" style="width: 100%; height: 400px;"></div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import * as echarts from 'echarts';
import { getGenderCountAPI, getAvgSalaryByJobAPI, getAvgSalaryByDeptAPI } from '@/api/stats';

// 1. 为每个图表容器创建一个 ref
const genderChart = ref<HTMLElement | null>(null);
const jobSalaryChart = ref<HTMLElement | null>(null);
const deptSalaryChart = ref<HTMLElement | null>(null);

/**
 * 初始化性别比例饼图
 */
const initGenderChart = async () => {
  const chartInstance = echarts.init(genderChart.value!);
  const response = await getGenderCountAPI();
  const result = response.data; // { code, msg, data }
  
  // 将后端数据 (gender: 1, count: 10) 转换为 ECharts 需要的格式
  const chartData = result.data.map((item: { count: any; gender: number; }) => ({
    value: item.count,
    name: item.gender === 1 ? '男' : '女'
  }));

  const option = {
    tooltip: { trigger: 'item' },
    legend: { top: '5%', left: 'center' },
    series: [
      {
        name: '性别比例',
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        label: { show: false, position: 'center' },
        emphasis: { label: { show: true, fontSize: '20', fontWeight: 'bold' } },
        labelLine: { show: false },
        data: chartData
      }
    ]
  };
  chartInstance.setOption(option);
};

/**
 * 初始化职位平均工资柱状图
 */
const initJobSalaryChart = async () => {
  const chartInstance = echarts.init(jobSalaryChart.value!);
  const response = await getAvgSalaryByJobAPI();
  const result = response.data;

  const option = {
    tooltip: { trigger: 'axis' },
    xAxis: {
      type: 'category',
      data: result.data.map((item: { name: any; }) => item.name)
    },
    yAxis: { type: 'value' },
    series: [{
      data: result.data.map((item: { avgSalary: number; }) => item.avgSalary.toFixed(2)), // 保留两位小数
      type: 'bar',
      showBackground: true,
      backgroundStyle: { color: 'rgba(180, 180, 180, 0.2)' }
    }]
  };
  chartInstance.setOption(option);
};

/**
 * 初始化部门平均工资柱状图
 */
const initDeptSalaryChart = async () => {
  const chartInstance = echarts.init(deptSalaryChart.value!);
  const response = await getAvgSalaryByDeptAPI();
  const result = response.data;

  const option = {
    tooltip: { trigger: 'axis' },
    xAxis: {
      type: 'value'
    },
    yAxis: { 
      type: 'category',
      data: result.data.map((item: { name: any; }) => item.name).reverse() // Y轴类目，数据反转一下更好看
    },
    series: [{
      data: result.data.map((item: { avgSalary: number; }) => item.avgSalary.toFixed(2)).reverse(),
      type: 'bar',
      label: { show: true, position: 'right' }
    }],
    grid: { left: '15%' } // 调整边距，防止Y轴标签被截断
  };
  chartInstance.setOption(option);
};

// 在组件挂载后，初始化所有图表
onMounted(() => {
  initGenderChart();
  initJobSalaryChart();
  initDeptSalaryChart();
});
</script>