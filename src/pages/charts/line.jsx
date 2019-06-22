import React from 'react'
import { Card, Button } from 'antd'
import ReactEcharts from 'echarts-for-react'


/**
 * 柱状图
 */
class Line extends React.Component {


  state = {
    sales: [5, 20, 36, 10, 10, 20],
    stores: [5, 201, 336, 10, 10, 20]
  }
  /**
   * 返回柱状图的配置对象
   */
  getOptions = (sales, stores) => {
    return {
      title: {
        text: 'ECharts 入门示例'
      },
      tooltip: {},
      legend: {
        data: ['销量', '库存']
      },
      xAxis: {
        data: ["衬衫", "羊毛衫", "雪纺衫", "裤子", "高跟鞋", "袜子"]
      },
      yAxis: {},
      series: [{
        name: '销量',
        type: 'line',
        data: sales
      }, {
        name: '库存',
        type: 'line',
        data: stores
      }]
    }
  }

  updata = () => {
    this.setState(state => ({
      sales: state.sales.map(sale => sale + 1),
      stores: state.stores.reduce((pre, store) => {
        pre.push(store - 1)
        return pre
      }, [])
    }))
  }
  render() {
    const { sales, stores } = this.state
    return (
      <div>
        <Card>
          <Button type='primary' onClick={this.updata}>更新</Button>
        </Card>
        <Card title="柱状图一">
          <ReactEcharts option={this.getOptions(sales, stores)}></ReactEcharts>
        </Card>
      </div >
    )
  }
}

export default Line