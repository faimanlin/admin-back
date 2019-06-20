import React from 'react'
import { Card, Button, Table, message, Modal } from 'antd'
import AddForm from './add-from'
import AuthForm from './auth-from'
import { PAGE_SIZE } from '../../utils/constants'
import { reqRoles, reqAddRole, reqUpdateRole } from '../../api'
import memoryUtils from '../../utils/memoryUtils'
import { formateDate, formateDate1 } from '../../utils/dateUtils'

/**
 * 角色
 */
class Role extends React.Component {

  state = {
    roles: [], //所有角色的列表
    role: {},//选中的role
    loading: false, //是否正在获取数据中
    isShowAdd: false,//是否显示添加页面
    isShowAuth: false//是否显示权限页面
  }

  constructor(props) {
    super(props)

    this.auth = React.createRef()
  }
  initColumn = () => {
    this.columns = [
      {
        title: "角色名称",
        dataIndex: "name"
      },
      {
        title: "创建时间",
        dataIndex: "create_time",
        render: (create_time) => formateDate1(create_time)
      },
      {
        title: "授权时间",
        dataIndex: "auth_time",
        render: formateDate
      },
      {
        title: "授权人",
        dataIndex: "auth_name"
      }
    ]
  }

  getRoles = async () => {
    this.setState({ loading: true })
    const result = await reqRoles()
    this.setState({ loading: false })
    if (result.status === 0) {
      const roles = result.data
      this.setState({
        roles
      })
    } else {
      message.error("获取列表失败")
    }
  }

  onRow = (role) => {
    return {
      onClick: event => { //点击行
        this.setState({
          role
        })
      }
    }
  }

  /**
   * 添加角色
   */
  addRole = () => {
    //表单验证
    this.form.validateFields(async (error, values) => {
      if (!error) {
        //隐藏确认框
        this.setState({ isShowAdd: false })
        //收集输入数据
        const { roleName } = values
        this.form.resetFields()
        //请求添加
        const result = await reqAddRole(roleName)
        if (result.status === 0) {
          message.success('添加角色成功')
          //新产生的角色
          const role = result.data
          //更新roles状态
          //1.第一种方法
          // const roles = [...this.state.roles]
          // roles.push(role)
          // this.setState({
          //   roles
          // })
          //2.第二种方法
          // this.setState(state => ({
          //   roles: [...state.roles, role]
          // }))
          //3.第二种方法//根据结果提示/更新列表显示
          this.getRoles()

        } else {
          message.error('添加角色失败')
        }
      }
    })
  }

  /**
   * 更新角色权限
   */

  updateRole = async () => {
    //隐藏确认框
    this.setState({ isShowAuth: false })
    const role = this.state.role
    const menus = this.auth.current.getMenus()
    console.log(menus)
    role.menus = menus
    role.auth_time = Date.now
    role.auth_name = memoryUtils.user.username
    console.log(memoryUtils.user.username)
    //请求更新
    const result = await reqUpdateRole(role)
    if (result.status === 0) {
      message.success("更新权限成功")
      //更新方法1.
      //this.getRoles()
      //更新方法2
      //由于引用变量的原因可以不用再请求查询接口
      this.setState({
        roles: [...this.state.roles]
      })
    } else {
      message.success("更新权限失败")
    }
  }


  componentWillMount() {
    this.initColumn()
  }
  componentDidMount() {
    this.getRoles()
  }

  render() {
    const { roles, role, loading, isShowAdd, isShowAuth } = this.state
    const title = (
      <span>
        <Button type="primary" style={{ marginRight: 10 }} onClick={() => this.setState({ isShowAdd: true })}>创建角色</Button>
        <Button type="primary" disabled={!role._id} onClick={() => this.setState({ isShowAuth: true })}>设置角色全线</Button>
      </span>
    )
    return (
      <Card title={title}>
        <Table
          bordered
          rowKey='_id'
          dataSource={roles}
          columns={this.columns}
          loading={loading}
          pagination={{ defaultPageSize: PAGE_SIZE, showQuickJumper: true }}
          rowSelection={{ type: 'radio', selectedRowKeys: [role._id] }}
          onRow={this.onRow}
        ></Table>
        <Modal
          title="添加分类"
          visible={isShowAdd}
          onOk={this.addRole}
          onCancel={() => {
            this.setState({ isShowAdd: false })
            this.form.resetFields()
          }}
        >
          <AddForm setForm={(form) => this.form = form} />
        </Modal>

        <Modal
          title="设置角色权限"
          visible={isShowAuth}
          onOk={this.updateRole}
          onCancel={() => { this.setState({ isShowAuth: false }) }}
        // onCancel={() => {
        //   this.setState({ isShowAuth: false })
        //   this.form.resetFields()
        // }}
        >
          <AuthForm role={role} ref={this.auth} />
        </Modal>
      </Card>
    )
  }
}

export default Role