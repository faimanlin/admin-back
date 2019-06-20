import React from 'react'
import PropsTypes from 'prop-types'
import { Form, Select, Input } from 'antd'

const Item = Form.Item;
const Option = Select.Option;
/**
 * 添加分类的from组件
 */
class AddForm extends React.Component {

  static propsType = {
    setForm: PropsTypes.func.isRequired,//用来传递form对象的函数
    categorys: PropsTypes.array.isRequired, //一级分类的数组
    parentId: PropsTypes.string.isRequired  //父分类id
  }

  componentWillMount() {
    //讲form对象通过setForm()传递父组件
    this.props.setFrom(this.props.form)
  }
  render() {
    const { getFieldDecorator } = this.props.form
    const { categorys, parentId } = this.props
    return (
      <Form>
        <Item>
          {getFieldDecorator('parentId',
            { initialValue: parentId }
          )(
            <Select placeholder="请选择一级分类">
              <Option value='0'>一级分类</Option>
              {
                categorys.map(c => <Option value={c._id} key={c._id}>{c.name}</Option>)
              }
            </Select>
          )
          }
        </Item>
        <Item>
          {getFieldDecorator('categoryName',
            {
              initialValue: '', 
              rules: [{
                required: true, message: "分类名称必须输入"
              }]
            }
          )(
            <Input placeholder="请输入分类名称" />
          )
          }

        </Item>
      </Form>
    )
  }
}

export default Form.create()(AddForm)