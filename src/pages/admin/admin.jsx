import React from 'react'
import { Redirect, Route, Switch } from 'react-router-dom'
import { Layout } from 'antd';
import memoryUtils from '../../utils/memoryUtils';
import LeftNav from '../../components/left-nav'
import Header from '../../components/header'
import Home from '../home/home'
import Category from '../category/category'
import Product from '../product/product'
import Role from '../role/role'
import User from '../user/user'
import Bar from '../charts/bar'
import Line from '../charts/line'
import Pie from '../charts/pie'

const { Footer, Sider, Content } = Layout;

/*
登陆的路由组件
*/
class Admin extends React.Component {
  render() {
    const user = memoryUtils.user
    //如果内存没有存储user ==>当前没登录
    if (!user || !user._id) {
      // 自动跳转到登录(在render()中)
      return <Redirect to='/login' />
    }
    return (
      <Layout style={{ minHeight: '100%' }}>
        <Sider>
          <LeftNav></LeftNav>
        </Sider>
        <Layout>
          <Header>Header</Header>
          <Content style={{ margin: '20px', background: '#fff' }}>
            <Switch>
              <Route path='/home' component={Home} />
              <Route path='/category' component={Category} />
              <Route path='/product' component={Product} />
              <Route path='/role' component={Role} />
              <Route path='/user' component={User} />
              <Route path='/charts/bar' component={Bar} />
              <Route path='/charts/line' component={Line} />
              <Route path='/charts/pie' component={Pie} />
              <Redirect to='/home' />
            </Switch>
          </Content>
          <Footer style={{ textAlign: 'center', color: '#333' }}>推荐使用谷歌浏览器,给你更好的体验效果</Footer>
        </Layout>
      </Layout>
    )
  }
}

export default Admin