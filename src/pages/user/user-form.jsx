import React from 'react'
import PropsTypes from 'prop-types'
import { Form, Select, Input } from 'antd'

const Item = Form.Item;
const Option = Select.Option;
/**
 * 添加/修改用户
 */
class UserForm extends React.PureComponent {

  static propTypes = {
    setForm: PropsTypes.func.isRequired, // 用来传递form对象的函数
    roles: PropsTypes.array.isRequired,
    user: PropsTypes.object
  }

  componentWillMount() {
    //讲form对象通过setForm()传递父组件
    this.props.setForm(this.props.form)
  }
  render() {
    const { roles, user } = this.props
    const { getFieldDecorator } = this.props.form
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
      <Form {...formItemLayout}>
        <Item label='用户名' >
          {getFieldDecorator('username',
            {
              initialValue: user.username,
              rules: [{
                required: true, message: "用户名必须输入"
              }]
            }
          )(
            <Input placeholder="请输入用户名" />
          )
          }
        </Item>
        {
          user._id ? null : (<Item label='密码' >
            {getFieldDecorator('password',
              {
                initialValue: user.password,
                rules: [{
                  required: true, message: "密码必须输入"
                }]
              }
            )(
              <Input type='password' placeholder="请输入密码" />
            )
            }
          </Item>)
        }

        <Item label='手机号' >
          {getFieldDecorator('phone',
            {
              initialValue: user.phone,
              rules: [{
                required: true, message: "手机号必须输入"
              }]
            }
          )(
            <Input placeholder="请输入手机号" />
          )
          }
        </Item>
        <Item label='邮箱' >
          {getFieldDecorator('email',
            {
              initialValue: user.email,
              rules: [{
                required: true, message: "密码必须输入"
              }]
            }
          )(
            <Input placeholder="请输入密码" />
          )
          }
        </Item>
        <Item label='角色' >
          {getFieldDecorator('role_id',
            {
              initialValue: user.role_id,
              rules: [{
                required: true, message: "密码必须输入"
              }]
            }
          )(
            <Select placeholder='请选择角色'>
              {
                roles.map(role => <Option key={role._id} value={role._id}>{role.name}</Option>)
              }

            </Select>
          )
          }
        </Item>
      </Form>
    )
  }
}

export default Form.create()(UserForm)