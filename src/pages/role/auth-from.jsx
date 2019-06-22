import React from 'react'
import PropsTypes from 'prop-types'
import { Form, Select, Input, Tree, } from 'antd'
import menuList from '../../config/menuConfig'

const Item = Form.Item;
const { TreeNode } = Tree

/**
 * 添加分类的from组件
 */
class AuthForm extends React.PureComponent {

  static propsType = {
    role: PropsTypes.object
  }


  constructor(props) {
    super(props)

    //根据传入的menus得到初始状态 
    const { menus } = this.props.role
    console.log(menus)
    this.state = {
      checkedKeys: menus
    }
  }

  getTreeNodes = (menuList) => {
    return menuList.reduce((pre, item) => {
      pre.push(
        <TreeNode title={item.title} key={item.key}>
          {item.children ? this.getTreeNodes(item.children) : null}
        </TreeNode>
      )
      return pre
    }, [])
  }

  /**
   * 为父组件获取新权限
   */
  getMenus = () => this.state.checkedKeys

  //选中某个noded时的回调
  onCheck = checkedKeys => {
    this.setState({ checkedKeys })
  }

  componentWillMount() {
    this.treeNodes = this.getTreeNodes(menuList)
  }

  //根据新传入的role来更新checkedkeys状态
  /**
   * 当组件接收到新的属性时自动调用
   */
  componentWillReceiveProps(nextProps) {
    const menus = nextProps.role.menus
    this.setState({
      checkedKeys: menus
    })
  }


  render() {
    const { role } = this.props
    const { checkedKeys } = this.state
    //指定Item布局的配置对象
    const formItemLayout = {
      labelCol: { //左侧label的宽度
        span: 4
      },
      wrapperCol: {//右侧包裹的宽度
        span: 15
      }
    };
    return (
      <div>
        <Item label='角色名称' {...formItemLayout}>
          <Input value={role.name} disabled />
        </Item>
        <Tree
          checkable
          defaultExpandAll={true}
          checkedKeys={checkedKeys}
          onCheck={this.onCheck}
        >
          <TreeNode title="平台权限" key="All">
            {this.treeNodes}
          </TreeNode>
        </Tree>
      </div >
    )
  }
}
export default AuthForm