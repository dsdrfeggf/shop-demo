import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'

Vue.use(VueRouter)

const routes = [
    //当用户直接访问时，重定向到login界面
    {path:'/',redirect:'/login'},
    {path:'/login',component:Login},
    {path:'/home',component:Home},

]

const router = new VueRouter({
  routes
})

router.beforeEach((to, from, next) => {
  // to 将要访问的路径
  // from 代表从哪个路径跳转而来
  // next 是一个函数，表示放行
  // next() 放行    next('/login') 强制跳转

  //如果用户访问的是登录页，直接放行
  if(to.path == "/login") return next()
  //获取token
  const tokenStr = window.sessionStorage.getItem('token')
  //如果没有token，强制跳转到登录页
  if(!tokenStr) return next('/login')
  //如果有token则放行
  next()
})

export default router
