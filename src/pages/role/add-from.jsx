import React from 'react'
import PropsTypes from 'prop-types'
import { Form, Select, Input } from 'antd'

const Item = Form.Item;
const Option = Select.Option;
/**
 * 添加分类的from组件
 */
class AddForm extends React.Component {

  static propTypes = {
    setForm: PropsTypes.func.isRequired, // 用来传递form对象的函数
  }

  componentWillMount() {
    //讲form对象通过setForm()传递父组件
    this.props.setForm(this.props.form)
  }
  render() {
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
      <Form>
        <Item label='角色名称' {...formItemLayout}>
          {getFieldDecorator('roleName',
            {
              initialValue: '',
              rules: [{
                required: true, message: "分类角色必须输入"
              }]
            }
          )(
            <Input placeholder="请输入角色名称" />
          )
          }

        </Item>
      </Form>
    )
  }
}

export default Form.create()(AddForm)