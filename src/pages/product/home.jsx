import React from 'react'
import {
  Card,
  Select,
  Input,
  Button,
  Icon,
  Table,
  message
} from 'antd'
import LinkButton from '../../components/link-button'
import { reqProducts, reqSearchProducts, reqUpdateStatus } from '../../api'
import { PAGE_SIZE } from '../../utils/constants'
const Option = Select.Option

/**
 * Product的默认子路由组件
 */
class ProductHome extends React.Component {
  state = {
    products: [],//商品的数组
    total: 0, //商品的总数量
    loading: false, //loading效果
    searchName: '',//搜索得关键字
    searchType: 'productName'//根据那个字段来搜

  }
  //初始化table的咧的数组
  initColumns = () => {
    this.columns = [
      {
        title: '商品名称',
        dataIndex: 'name',
      },
      {
        title: '商品描述',
        dataIndex: 'desc',
      },
      {
        title: '价格',
        dataIndex: 'price',
        render: (price) => '$' + price //当前制定了对应的属性,传入的事对应的属性值
      },
      {
        title: '状态',
        width: 100,
        render: (product) => {
          const { status, _id } = product
          const newStatus = status === 1 ? 2 : 1
          return (
            <span>
              <Button type="primary"
                onClick={() => this.updateStatus(_id, newStatus)}
              >
                {status === 1 ? '下架' : '上架'}
              </Button>
              <span>{status === 1 ? '在售' : '已下架'}</span>
            </span>
          )
        }
      },
      {
        title: '操作',
        width: 100,
        render: (product) => {
          return (
            <span>
              {/*将product对象使用state传递给目标路由组件*/}
              <LinkButton onClick={() => this.props.history.push('/product/detail', { product })}>详情</LinkButton>
              <LinkButton onClick={() => this.props.history.push('/product/addupdate', product)}>修改</LinkButton>
            </span>
          )
        }
      }
    ];
  }
  /**
   * 获取指定页码的列表数据显示
   */
  getProducts = async (pageNum) => {
    this.pageNum = pageNum //保存pageNum,让其他方法可以看到
    this.setState({ loading: true })
    const { searchName, searchType } = this.state

    //如果搜索关键字有值,说明我们要做搜索分页
    let result
    if (searchName) {
      result = await reqSearchProducts({ pageNum, pageSize: PAGE_SIZE, searchName, searchType })
    } else {
      result = await reqProducts(pageNum, PAGE_SIZE)
    }

    console.log(result)
    this.setState({ loading: false })
    if (result.status === 0) {
      //取出分页数据,更新状态,显示分页列表
      const { total, list } = result.data
      this.setState({
        total,
        products: list
      })
    }
  }
  /**
   * 更新指定商品的状态
   */
  updateStatus = async (parentId, status) => {
    const result = await reqUpdateStatus(parentId, status)
    if (result.status === 0) {
      message.success('更新商品成功')
      this.getProducts(this.pageNum)
    }
  }
  componentWillMount() {
    this.initColumns()
  }
  componentDidMount() {
    this.getProducts(1)
  }
  render() {
    //取出商品数组
    const { products, total, loading, searchType, searchName } = this.state
    console.log(total)

    const title = (
      <span>
        <Select value={searchType} style={{ width: 150 }}
          onChange={value => this.setState({ searchType: value })}>
          <Option value='productName'>按名称搜索</Option>
          <Option value='productDesc'>按描述搜索</Option>
        </Select>
        <Input placeholder="关键字" style={{ width: 150, margin: '0 15px' }} value={searchName}
          onChange={event => this.setState({ searchName: event.target.value })}></Input>
        <Button type="primary" onClick={() => this.getProducts(1)}>搜索</Button>
      </span>
    )
    const extra = (
      <Button type="primary" onClick={() => this.props.history.push('/product/addupdate')}>
        <Icon type="plus" />
        添加商品
      </Button>
    )
    return (
      <Card title={title} extra={extra}>
        <Table loading={loading} dataSource={products} columns={this.columns} rowKey="_id" bordered
          pagination={{ total: total, defaultPageSize: PAGE_SIZE, showQuickJumper: true, onChange: (pageNum) => { this.getProducts(pageNum) } }} />;
      </Card>
    )
  }
}

export default ProductHome