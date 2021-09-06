<template>
  <el-container class="home-page">
    <!-- 头部区域 -->
  <el-header>
    <div>
      <img src="../assets/heima.png" alt="">
      <span>电商后台管理系统</span>
    </div>
    <el-button type="info" @click="logout">退出</el-button>
  </el-header>
  <!-- 页面主体区域 -->
  <el-container>
    <!-- 侧边栏 -->
    <el-aside :width="this.isCollapse ? '64px' : '200px'">
      <div class="toggle-button" @click="toggleCollapse">|||</div>
      <!-- 侧边栏菜单区域 -->
      <el-menu
      background-color="#333744"
      text-color="#fff"
      active-text-color="#ffd04b" unique-opened :collapse="this.isCollapse" :collapse-transition="false" router
      :default-active="activeInfo">
      <!-- 一级菜单 -->
      <el-submenu :index="item.id + ''" v-for="item in menuInfo" :key="item.id">
        <!-- 一级菜单的模板区域 -->
        <template slot="title">
          <!-- 图标 -->
          <i :class="iconObj[item.id]"></i>
          <!-- 文本 -->
          <span>{{item.authName}}</span>
        </template>
          <!-- 二级菜单 -->
          <el-menu-item :index="'/'+item.path" v-for="item in item.children" :key="item.id" @click="saveActiveInfo('/'+item.path)">
            <template slot="title">
          <!-- 图标 -->
          <i class="el-icon-menu"></i>
          <!-- 文本 -->
          <span>{{item.authName}}</span>
        </template>
          </el-menu-item>
      </el-submenu>
    </el-menu>
    </el-aside>
    <!-- 右侧内容主体 -->
    <el-main>
      <!-- 路由占位符 -->
      <router-view></router-view>
    </el-main>
  </el-container>
</el-container>
</template>

<script>
export default {
  data(){
    return{
      menuInfo:[],
      iconObj:{
        '125':'iconfont icon-user',
        '103':'iconfont icon-tijikongjian',
        '101':'iconfont icon-shangpin',
        '102':'iconfont icon-danju',
        '145':'iconfont icon-baobiao'
      },
      isCollapse:false,
      activeInfo:''
    }
  },
  created(){
    this.getMenuInfo()
    // 组件被创建时就获取active的值以显示指定组件的激活状态
    this.activeInfo = window.sessionStorage.getItem('active')
  },
  methods: {
    logout(){
      //清除浏览器中的token
      window.sessionStorage.clear();

      //跳转到登录页面
      this.$router.push('/login');
    },
    // 获取菜单列表
    async getMenuInfo(){
      const {data:res} = await this.$http.get('menus')
      if(res.meta.status !== 200){
        return this.$message.error(res.meta.msg)
      }
      this.menuInfo = res.data
    },
    // 点击按钮，切换菜单的折叠与展开
    toggleCollapse(){
      this.isCollapse = !this.isCollapse
    },
    //将active的值保存到sessionStorage中，以便随时调用
    saveActiveInfo(index){
    window.sessionStorage.setItem('active',index)
    this.activeInfo = index
    }
  },

}
</script>

<style>
.home-page{
  height: 100%;
}
.el-header{
  background-color: #373d41;
  display: flex;
  justify-content: space-between;
  padding-left: 0;
  align-items: center;
  color: #fff;
  font-size: 20px;
}
.el-header div{
  display: flex;
  align-items: center;

}
.el-header div span{
  margin-left: 15px;
}
.el-aside{
  background-color: #333744;
}
.el-aside .el-menu{
  /* 去除右侧边框线 */
  border-right: none;
}
.el-main{
  background-color: #eaedf1;
}
.iconfont{
  margin-right: 10px;
}
.toggle-button{
  background-color: #4A5064;
  font-size: 10px;
  line-height: 24px;
  color: #fff;
  text-align: center;
  letter-spacing: 0.2em;
  /* 鼠标移入时改变样式 */
  cursor: pointer;
}

</style>