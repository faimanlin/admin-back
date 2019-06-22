import React from 'react'
import { Card, Form, Input, Cascader, Upload, Button, Icon, message } from 'antd'
import LinkButton from '../../components/link-button';
import PicturesWall from './pictures-wall'
import RichTextEditor from './rich-text-editor'
import { reqCategroys, reqAddOrUpdateProduct } from '../../api'

const { Item } = Form
const { TextArea } = Input



class ProductAddUpdate extends React.PureComponent {


  state = {
    options: [],
  };

  constructor(props) {
    super(props)
    //创建用来保存ref表示的标签对象的容器
    this.pw = React.createRef()
    this.editor = React.createRef()
  }

  initOptions = async (categorys) => {
    //根据categorys生成个options数组
    const options = categorys.map(c => ({
      value: c._id,
      label: c.name,
      isLeaf: false
    }))

    //如果是一个二级分类商品的更新
    const { isUpdate, product } = this
    const { pCategoryId, categoryId } = product
    if (isUpdate && pCategoryId !== 0) {
      //获取对应的二级分类列表
      const subCategorys = await this.getCategorys(pCategoryId)
      //生成二级下拉列表options
      const childOptions = subCategorys.map(c => ({
        value: c._id,
        label: c.name,
        isLeaf: true
      }))
      //找到当前商品对应的一级options对象
      const targetOption = options.find(options => options.value === pCategoryId)
      //关联到对应的一级options上
      targetOption.children = childOptions
    }

    //更新options状态
    this.setState({
      options
    })
  }

  /**
   * 获取分类的一级/二级列表
   * async函数的返回值是一个新的promise对象,promise的结果和值由async的结果来决定
   */
  getCategorys = async (parentId) => {
    const result = await reqCategroys(parentId)
    if (result.status === 0) {
      const categorys = result.data
      //判断如果是一级分类列表
      if (parentId === '0') {
        this.initOptions(categorys)
      } else {
        return categorys //返回二级列表 ==>当前async函数返回的promise就会成功且value为categorys
      }
    }
  }


  /**
   * 验证价格的自定义验证函数
   */
  validatePrice = (rule, value, callback) => {
    if (value * 1 > 0) {
      callback()//验证通过
    } else {
      callback('价格必须大于0')//验证不通过
    }

  }
  submit = () => {
    //进行表单验证,如果通过了,才发送请求
    this.props.form.validateFields(async (err, valuse) => {
      if (!err) {
        //1.收集数据,并封装成product对象
        const { name, desc, price, categoryIds } = valuse

        let pCategoryId, categoryId
        if (categoryIds.length === 1) {
          pCategoryId = '0'
          categoryId = categoryIds[0]
        } else {
          pCategoryId = categoryIds[0]
          categoryId = categoryIds[1]
        }
        const imgs = this.pw.current.getImgs()
        const detail = this.editor.current.getDetail()
        const product = { name, desc, price, imgs, detail }
        //如果是更新,需要添加_id
        if (this.isUpdate) {
          product._id = this.product._id
        }

        //2.调用接口请求函数去添加/更新
        const result = await reqAddOrUpdateProduct(product)

        //3.更具结果提示
        if (result.status === 0) {
          message.success(`${this.isUpdate ? "更新" : "添加"}商品成功`)
          console.log(product)
          this.props.history.goBack()
        } else {
          console.log(product)
          message.error(`${this.isUpdate ? "更新" : "添加"}商品失败`)
        }
      }
    })
  }


  loadData = async selectedOptions => {
    // 得到选择的option对象
    const targetOption = selectedOptions[selectedOptions.length - 1];
    //显示loading
    targetOption.loading = true;
    //根据选中的分类,请求获取二级分类列表
    const subCategorys = await this.getCategorys(targetOption.value)
    targetOption.loading = false;
    if (subCategorys && subCategorys.length > 0) {
      //生成一个二级列表的options
      const childOptions = subCategorys.map(c => ({
        value: c._id,
        label: c.name,
        isLeaf: true
      }))
      //关联到当前options上
      targetOption.children = childOptions
    } else {//当前选中的分类没有二级分类
      targetOption.isLeaf = true
    }

    //更新options状态
    this.setState({
      options: [...this.state.options],
    });
  };

  componentDidMount() {
    this.getCategorys('0')
  }

  componentWillMount() {
    //取出携带的state
    const product = this.props.location.state //如果是添加没有值,否则是有值
    //保存是否更新的标识
    this.isUpdate = !!product
    //保存商品(如果没有,保存是{})
    this.product = product || {}
  }


  render() {
    const { isUpdate, product } = this
    const { pCategoryId, categoryId, imgs, detail } = product
    //用来接收级联分ID的数组
    const categoryIds = []

    if (isUpdate) {
      if (pCategoryId === '0') {
        //商品是一个一级分类的商品
        categoryIds.push(categoryId)
      } else {
        //商品是一个二级分类的商品
        categoryIds.push(pCategoryId)
        categoryIds.push(categoryId)
      }
      console.log(categoryIds)

    }

    const title = (
      <span>
        <LinkButton onClick={() => this.props.history.goBack()}>
          <Icon type="arrow-left" style={{ fontSize: 20 }} />
        </LinkButton>
        <span>{isUpdate ? '修改商品' : '添加商品'}</span>
      </span>
    )

    const { getFieldDecorator } = this.props.form


    //指定Item布局的配置对象
    const formItemLayout = {
      labelCol: { //左侧label的宽度
        span: 2
      },
      wrapperCol: {//右侧包裹的宽度
        span: 8
      }
    };

    return (
      <Card title={title} >
        <Form {...formItemLayout} >
          <Item label="商品名称">
            {getFieldDecorator('name', {
              initialValue: product.name,
              rules: [
                { required: true, message: "必须输入商品名称" }
              ]
            })(
              <Input placeholder="请输入商品名称"></Input>
            )}

          </Item>
          <Item label="商品描述">
            {getFieldDecorator('desc', {
              initialValue: product.desc,
              rules: [
                { required: true, message: "必须输入商品描述" }
              ]
            })(
              <TextArea placeholder="请输入商品描述" autosize></TextArea>
            )}

          </Item>
          <Item label="商品价格">
            {getFieldDecorator('price', {
              initialValue: product.price,
              rules: [
                { required: true, message: "必须输入商品价格" },
                { validator: this.validatePrice }
              ]
            })(
              <Input type='number' placeholder="请输入商品价格" addonAfter="元"></Input>
            )}

          </Item>
          <Item label="商品分类">
            {getFieldDecorator('categoryIds', {
              initialValue: categoryIds,
              rules: [
                { required: true, message: "必须指定商品价格" }
              ]
            })(
              <Cascader
                placeholder="请指定商品分类"
                options={this.state.options}//需要显示的列表数据数组
                loadData={this.loadData}//当选择某个列表项,加载下一级列表
              />
            )}

          </Item>
          <Item label="商品图片">
            <PicturesWall ref={this.pw} imgs={imgs} />
          </Item>
          <Item label="商品详情" labelCol={{ span: 2 }} wrapperCol={{ span: 20 }}>
            <RichTextEditor ref={this.editor} detail={detail} />
          </Item>
          <Item>
            <Button type="primary" onClick={this.submit}>提交</Button>
          </Item>
        </Form>
      </Card >
    )
  }
}

export default Form.create()(ProductAddUpdate)