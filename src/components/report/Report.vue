<template>
  <div>
      <!-- 面包屑导航区域 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/hmoe' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item><a href="/">数据统计</a></el-breadcrumb-item>
      <el-breadcrumb-item>数据报表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
        <!-- 为ECharts准备一个具备大小（宽高）的DOM -->
        <div id="main" style="width:600px;height:400px"></div>
    </el-card>
  </div>
</template>

<script>
import * as echarts from 'echarts'
import _ from 'lodash'

export default {
    data(){
        return{
            // 需要合并的数据
            options: {
                    title: {
                    text: '用户来源'
                    },
                    tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'cross',
                        label: {
                        backgroundColor: '#E9EEF3'
                        }
                    }
                    },
                    grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                    },
                    xAxis: [
                    {
                        boundaryGap: false
                    }
                    ],
                    yAxis: [
                    {
                        type: 'value'
                    }
                    ]
                }
        }
    },
    created(){

    },
    // 此时，页面上的元素，已经被渲染完毕了
    async mounted() {
        //基于准备好的dom，初始化echarts实例
        var myChart = echarts.init(document.getElementById('main'))

        const {data:res} = await this.$http.get(`reports/type/1`)
        if(res.meta.status!==200){
            return this.$message.error('获取折线图数据失败！')
        }
        console.log(res);
        // 4.准备数据和配置项
        const result = _.merge(res.data,this.options)//将服务器返回的数据和数据选项进行合并
        // 5.展示数据
        myChart.setOption(res.data)
    },
}
</script>

<style>

</style>