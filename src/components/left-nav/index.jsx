import React from 'react'
import { Link, withRouter } from 'react-router-dom'
import { Menu, Icon } from 'antd';
import logo from '../../assets/images/logo.png'
import menuList from '../../config/menuConfig'
import './index.less'

const { SubMenu } = Menu;
/**
 * 左侧导航的组件
 */




class LeftNav extends React.Component {
  /**
 * 根据menu的数据组成对应的标签
 * 使用map()+递归调用
 */

  getMenuNodes_map = (menuList) => {
    return menuList.map(item => {
      if (!item.children) {
        return (
          <Menu.Item key={item.key}>
            <Link to={item.key}>
              <Icon type={item.icon} />
              <span>{item.title}</span>
            </Link>
          </Menu.Item>)
      } else {
        return (
          <SubMenu
            key={item.key}
            title={
              <span>
                <Icon type={item.icon} />
                <span>{item.title}</span>
              </span>
            }
          >
            {this.getMenuNodes(item.children)}
          </SubMenu>
        )
      }
    })
  }

  /**
 * 根据menu的数据组成对应的标签
 * reduce()+递归调用
 */

  getMenuNodes = (menuList) => {
    return menuList.reduce((pre, item) => {
      //向pre添加<menu.item>
      if (!item.children) {
        pre.push((
          <Menu.Item key={item.key}>
            <Link to={item.key}>
              <Icon type={item.icon} />
              <span>{item.title}</span>
            </Link>
          </Menu.Item>))
      } else {
        const path = this.props.location.pathname
        //查找一个与当前请求路径匹配的Item
        const cItem = item.children.find(cItem => path.indexOf(cItem.key) === 0)
        //如果纯在,说明当前item的子列表需要打开
        if (cItem) {
          this.openKey = item.key
        }
        pre.push((
          <SubMenu
            key={item.key}
            title={
              <span>
                <Icon type={item.icon} />
                <span>{item.title}</span>
              </span>
            }
          >
            {this.getMenuNodes(item.children)}
          </SubMenu>
        ))
      }
      //向pre添加submenu
      return pre
    }, [])
  }
  /**
   *  在第一次render()之前执行一次
   *  为第一次render()准备数据做渲染(必须同步的)
   */

  componentWillMount() {
    this.menuNode = this.getMenuNodes(menuList)
  }

  render() {
    //得到当前请求的路由路径
    let path = this.props.location.pathname
    if (path.indexOf('/product') === 0) {
      path = '/product'
    }
    //得到需要打开菜单的key
    const openKey = this.openKey
    return (
      <div className="left-nav">
        <Link to='/' className="left-nav-header">
          <img src={logo} alt="guigu" />
          <h1>硅谷后台</h1>
        </Link>
        <Menu
          mode="inline"
          theme="dark"
          selectedKeys={[path]}
          defaultOpenKeys={[openKey]}
        >
          {this.menuNode}
        </Menu>
      </div>

    )
  }
}
/**
 * withRouter 高阶组件:
 * 包装非路由组件,返回一个新的组件
 * 新的组件向非路由组件传递3个属性:history/location/math
 */

export default withRouter(LeftNav)