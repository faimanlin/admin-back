import React from 'react'
import { Upload, Icon, Modal, message } from 'antd';
import PropTypes from 'prop-types'
import { reqDeleteImg } from '../../api'

/*
用于图片上传的组件
 */

function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

class PicturesWall extends React.Component {
  static propType = {
    imgs: PropTypes.array
  }
  state = {
    previewVisible: false, //标识是否显示大图预览
    previewImage: '',//大图的url
    fileList: [
      // {
      //   uid: '-1', //每个file都有自己唯一的id
      //   name: 'xxx.png',//图片文件名
      //   status: 'done',//图片状态done代表已上传图片,uploading:正在上传中,removed:已删除
      //   url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',//图片地址
      // },
    ],
  };

  constructor(props) {
    super(props)
    let fileList = []
    const { imgs } = this.props
    if (imgs && imgs.length > 0) {
      fileList = imgs.map((img, index) => ({
        uid: -index, // 每个file都有自己唯一的id
        name: img, // 图片文件名
        status: 'done', // 图片状态: done-已上传, uploading: 正在上传中, removed: 已删除
        //url: BASE_IMG_URL + img
        url: 'https://reviveimg.hellorf.com/www/images/0b1fd2c9e6130aef341b774345ab0d53.jpg'
      }))
    }

    // 初始化状态
    this.state = {
      previewVisible: false, // 标识是否显示大图预览Modal
      previewImage: '', // 大图的url
      fileList // 所有已上传图片的数组
    }

  }

  /**
   * 隐藏modal
   */
  handleCancel = () => this.setState({ previewVisible: false });

  handlePreview = async file => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    //显示指定file的大图
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true,
    });
  };

  /**
   * file:当前操作的图片文件(上传/删除)
   *fileList:所有已上传图片文件对象的数组
   */
  handleChange = async ({ file, fileList }) => {
    // console.log(file)
    //一旦上传成功,将当前上传的file的信息修正(name,url)
    if (file.status === 'done') {
      const result = file.response
      console.log(file)
      if (result.status === 0) {
        message.success('上传图片成功!')
        const { name, url } = result.data
        file = fileList[fileList.length - 1]
        file.name = name
        file.url = url
      } else {
        message.error('上传图片失败')
      }
    } else if (file.status === 'removed') {
      //删除图片
      const result = await reqDeleteImg(file.name)
      if (result.status === 0) {
        message.success('删除图片成功!')
      } else {
        message.success('删除图片失败!')
      }
    }


    //操作(上传/删除)过程更新fileList状态
    this.setState({ fileList })
  };

  /**
   * 获取所有已上传图片文件名的数组
   */
  getImgs = () => {
    return this.state.fileList.map(file => file.name)
  }

  render() {
    const { previewVisible, previewImage, fileList } = this.state;
    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">Upload</div>
      </div>
    );
    return (
      <div>
        <Upload
          action="https://www.mocky.io/v2/5cc8019d300000980a055e76" /*上传图片的接口地址*/
          accept='image/*'  /*只接收图片格式*/
          name='image' /*请求参数名*/
          listType="picture-card"  /*卡片样式*/
          fileList={fileList}  /*所有已上传图片文件对象的数组*/
          onPreview={this.handlePreview}
          onChange={this.handleChange}
        >
          {fileList.length >= 4 ? null : uploadButton}
        </Upload>

        <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </div>
    );
  }
}

export default PicturesWall

/**
 * 1.子组件调用父组件的方法:将父组件的方法以函数属性的形式传递给子组件,子组件就可以调用
 * 2.父组件调用子组件的方法:通过在父组件中通过ref得到子组件标签对象(也就是组件对象),调用其他方法
 */