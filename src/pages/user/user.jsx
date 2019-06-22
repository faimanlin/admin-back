import React from 'react'
import { Card, Button, Table, Modal, message } from 'antd'
import { formateDate } from '../../utils/dateUtils'
import LinkButton from '../../components/link-button'
import { PAGE_SIZE } from '../../utils/constants'
import { reqUsers, reqDeleteUser, reqAddOrUpdateUser } from '../../api'
import UserForm from './user-form'
/**
 * 用户
 */
class User extends React.Component {

  state = {
    users: [], //所有用户列表
    roles: [],//所有角色的列表
    loading: false, //loading
    isShow: false//是否显示模态窗
  }

  /**
   * 根据roles的数组,生成包含所有角色名的对象(属性名用过角色id值)
   */
  initRoleNames = (roles) => {
    const roleName = roles.reduce((pre, role) => {
      pre[role._id] = role.name
      return pre
    }, {})
    //保存起来
    this.roleName = roleName
  }

  initColumns = () => {
    this.columns = [
      {
        title: '用户名称',
        dataIndex: 'username'
      },
      {
        title: '邮箱',
        dataIndex: 'email'
      },
      {
        title: '电话',
        dataIndex: 'phone'
      },
      {
        title: '注册时间',
        dataIndex: 'create_time',
        render: (create_time) => formateDate(create_time)
      },
      {
        title: '所属角色',
        dataIndex: 'role_id',
        render: (role_id) => this.roleName[role_id]
      },

      {
        title: '操作',
        render: (user) => (
          <span>
            <LinkButton onClick={() => this.showUpdate(user)}>修改</LinkButton>
            <LinkButton onClick={() => { this.deleteUser(user) }}>删除</LinkButton>
          </span>
        )
      }
    ]
  }

  /**
   * 添加用户
   */
  addOrUpdateUser = async () => {
    this.setState({ isShow: false })
    //1.收集输入数据
    const user = this.form.getFieldsValue()
    this.form.resetFields()
    // 如果是更新,需要给user指定_id属性
    if (this.user) {
      user._id = this.user._id
    }

    //2.提交添加请求
    const result = await reqAddOrUpdateUser(user)
    //3更新列表显示
    if (result.status === 0) {
      message.success(`${this.user ? '修改' : '添加'}用户成功`)
      this.getUsers()
    }
  }

  /*
  删除用户
   */
  deleteUser = (user) => {
    Modal.confirm({
      title: `确认删除${user.username}`,
      onOk: async () => {
        const result = await reqDeleteUser(user._id)
        if (result.status === 0) {
          message.success("删除成功")
          this.getUsers()
        } else {
          message.success("删除失败")
        }
      }
    })
  }

  /**
   * 获取用户
   */
  getUsers = async () => {
    this.state.loading = true
    const result = await reqUsers()
    this.state.loading = false
    if (result.status === 0) {
      const { users, roles } = result.data
      this.initRoleNames(roles)
      this.setState({
        users,
        roles
      })
    }
  }

  /**
   * 显示修改用户
   */
  showUpdate = (user) => {
    this.user = user //保存user
    this.setState({
      isShow: true
    })
  }
  /**
   * 显示创建用户
   */
  showAdd = () => {
    this.user = null //去除user
    this.setState({
      isShow: true
    })
  }

  componentWillMount() {
    this.initColumns()
  }
  componentDidMount() {
    this.getUsers()
  }

  render() {
    const title = (
      <span>
        <Button type='primary' onClick={this.showAdd}> 创建用户</Button>
      </span>
    )

    const { users, loading, isShow, roles } = this.state
    const user = this.user || {}
    return (
      <Card title={title}>
        <Table
          bordered
          rowKey='_id'
          dataSource={users}
          columns={this.columns}
          loading={loading}
          pagination={{ defaultPageSize: PAGE_SIZE }} />

        <Modal
          title={user._id ? "修改用户" : "添加用户"}
          visible={isShow}
          onOk={this.addOrUpdateUser}
          onCancel={() => {
            this.setState({ isShow: false })
            this.form.resetFields()
          }
          }
        >
          <UserForm user={user} setForm={form => this.form = form} roles={roles} />
        </Modal>
      </Card >
    )
  }
}

export default User