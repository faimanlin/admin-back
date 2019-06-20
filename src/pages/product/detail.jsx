import React from 'react'
import { Card, Icon, List } from 'antd'
import LinkButton from '../../components/link-button'
import { BASE_IMG_URL } from "../../utils/constants"
import { reqCategroy } from "../../api"
const Item = List.Item

class ProductDetail extends React.Component {
  state = {
    cName1: '',//一级分类名称
    cName2: ''//二级分类名称
  }

  async componentDidMount() {
    //得到当前商品的分类ID
    const { pCategoryId, categoryId } = this.props.location.state.product
    if (pCategoryId === 0) {//一级分类下的商品
      const result = await reqCategroy(categoryId);
      const cName1 = result.data.name
      this.setState({ cName1 })
    } else {
      //一次性发多个请求,只有都成功了,才正常处理
      const results = await Promise.all([reqCategroy(pCategoryId), reqCategroy(categoryId)])
      const cName1 = results[0].data.name
      const cName2 = results[1].data.name
      this.setState({
        cName1,
        cName2
      })
    }
  }
  render() {
    //读取携带过来的state数据
    const { name, desc, price, detail, imgs } = this.props.location.state.product
    const { cName1, cName2 } = this.state
    const title = (
      <span>
        <LinkButton >
          <Icon type="arrow-left" style={{ color: 'green', marginRight: 15, fontSize: 20, cursor: PointerEvent }}
            onClick={() => this.props.history.goBack()}
          ></Icon>
        </LinkButton>
        <span>商品详情</span>
      </span >
    )
    return (
      <Card title={title} className='product-detail'>
        <List>
          <Item>
            <span className="left">商品名称:</span>
            <span>{name}</span>
          </Item>
          <Item>
            <span className="left">商品描述:</span>
            <span>{desc}</span>
          </Item>
          <Item>
            <span className="left">商品价格:</span>
            <span>{price}</span>
          </Item>
          <Item>
            <span className="left">所属分类:</span>
            <span>{cName1} {cName2?"--->"+cName1:''}</span>
          </Item>
          <Item>
            <span className="left">商品图片:</span>
            <span>
              {
                imgs.map(img => (
                  <img key={img} src={BASE_IMG_URL + img} alt="图片" className="product-img" />
                ))
              }
            </span>
          </Item>
          <Item>
            <span className="left">商品详情:</span>
            <span dangerouslySetInnerHTML={{ __html: detail }}></span>
          </Item>
        </List>
      </Card>
    )
  }
}

export default ProductDetail