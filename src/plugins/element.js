import Vue from 'vue'
import { Button } from 'element-ui'
import {Form , FormItem} from 'element-ui'
import {Input} from 'element-ui'
//导入弹框提示组件
import {Message,Select,Tabs,TabPane,Alert,Option,Cascader,Tree,Dialog,Pagination,Tag,Container,MessageBox,Switch,Tooltip,Table,TableColumn,Header,Aside,Card,Main,Menu,Submenu,MenuItem,Breadcrumb,BreadcrumbItem,Row,Col} from 'element-ui'

Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Container)
Vue.use(Header)
Vue.use(Aside)
Vue.use(Main)
Vue.use(Menu)
Vue.use(Submenu)
Vue.use(MenuItem)
Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)
Vue.use(Card)
Vue.use(Row)
Vue.use(Col)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Switch)
Vue.use(Tooltip)
Vue.use(Pagination)
Vue.use(Dialog)
Vue.use(Tag)
Vue.use(Tree)
Vue.use(Select)
Vue.use(Option)
Vue.use(Cascader)
Vue.use(Alert)
Vue.use(Tabs)
Vue.use(TabPane)

//全局挂载  每个组件都可以通过this来调用组件
Vue.prototype.$message = Message
Vue.prototype.$confirm = MessageBox.confirm