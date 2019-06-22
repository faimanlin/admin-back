import React from 'react'
import { Modal } from 'antd';
import { withRouter } from 'react-router-dom'
import { reqWeater } from '../../api/index'
import { formateDate } from '../../utils/dateUtils'
import { connect } from 'react-redux'
import LinkButton from '../link-button'
import menuList from '../../config/menuConfig'
import {logout} from '../../redux/actions'

import './index.less'

/**
 * 左侧导航的组件
 */
class Header extends React.Component {
  state = {
    currentTime: formateDate(Date.now()),//当前字符串时间
    dayPictureUrl: '',//天气图片
    weather: ''//天气文本
  }

  getTime = () => {
    this.interId = setInterval(() => {
      const currentTime = formateDate(Date.now())
      this.setState({ currentTime })
    }, 1000)
  }

  getTitle = () => {
    //得到输入地址
    const path = this.props.location.pathname
    let title
    menuList.forEach(item => {
      if (item.key === path) {
        title = item.title
      } else if (item.children) {
        //在所有的子item中查找匹配
        const cItem = item.children.find(cItem => path.indexOf(cItem.key) === 0)
        //如果有值才说明有匹配的
        if (cItem) {
          //取出它的title
          title = cItem.title
        }
      }
    })
    return title
  }

  getWeather = async () => {
    //异步获取天气
    const { dayPictureUrl, weather } = await reqWeater('深圳')
    //状态更新
    this.setState({ dayPictureUrl, weather })
  }

  /**
   * 退出登录
   */
  logout = () => {
    //显示对话框
    Modal.confirm({
      content: '确定退出吗?',
      onOk: () => {
        //删除保存的user数据
        // storageUtils.removeUser()
        // memoryUtils.user = {}
        this.props.logout()
      }
    });
  }

  /**
   * 在第一次render()只有执行一次
   * 一般在此执行一部操作:发ajax请求/启动定时器
   */
  componentDidMount() {
    //获取当前的时间
    this.getTime()
    //获取当前天气
    this.getWeather()
  }
  /**
   * 当前组件卸载之前调用
   */
  componentWillUnmount() {
    //清除定时器
    clearInterval(this.interId);
  }

  render() {
    const { currentTime, dayPictureUrl, weather } = this.state
    const username = this.props.user.username
    //获取当前页面标题
    //const title = this.getTitle()
    const title = this.props.headTitle
    return (
      <div className="header">
        <div className="header-top">
          <span>欢迎,{username}</span>
          <LinkButton onClick={this.logout}>退出</LinkButton>
        </div>
        <div className="header-bottom">
          <div className="header-bottom-left">{title}</div>
          <div className="header-bottom-right">
            <span>{currentTime}</span>
            <img src={dayPictureUrl} alt="weather" />
            <span>{weather}</span>
          </div>
        </div>
      </div>
    )
  }
}

export default connect(
  state => ({headTitle: state.headTitle, user: state.user}),
  {logout}
)(withRouter(Header))