import React, { Component } from 'react';
import { EditorState, convertToRaw, ContentState } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import PropTypes from 'prop-types'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'

export default class RichTextEditor extends Component {
  static propTypes = {
    detail: PropTypes.string
  }
  state = {
    editorState: EditorState.createEmpty(), //创建一个没有内容的编辑对象
  }

  constructor(props) {
    super(props);
    const html = this.props.detail;
    if (html) {//如果有值,根据html创建对应的值
      const contentBlock = htmlToDraft(html);
      if (contentBlock) {
        const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
        const editorState = EditorState.createWithContent(contentState);
        this.state = {
          editorState,
        };
      }
    } else {//如果没有值就创建空对象
      editorState: EditorState.createEmpty()
    }
  }

  /**
   * 如果过程中实时回调
   */
  onEditorStateChange = (editorState) => {
    //返回输入数据对应的html格式
    this.setState({
      editorState,
    });
  };



  getDetail = () => {
    return draftToHtml(convertToRaw(this.state.editorState.getCurrentContent()))
  }

  uploadImageCallBack = (file) => {
    return new Promise(
      (resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('POST', 'https://www.mocky.io/v2/5cc8019d300000980a055e76');
        // xhr.open('POST', '/manage/img/upload');
        const data = new FormData();
        data.append('image', file);
        xhr.send(data);
        xhr.addEventListener('load', () => {
          const response = JSON.parse(xhr.responseText);
          console.log(response)
          const url = response.url
          resolve({ data: { link: url } });
        });
        xhr.addEventListener('error', () => {
          const error = JSON.parse(xhr.responseText);
          reject(error);
        });
      }
    );
  }

  render() {
    const { editorState } = this.state;
    return (
      <Editor
        editorState={editorState}
        editorStyle={{ border: '1px solid black', minHeight: 200, paddingLeft: 10 }}
        onEditorStateChange={this.onEditorStateChange}
        toolbar={{
          image: { uploadCallback: this.uploadImageCallBack, alt: { present: true, mandatory: true } },
        }}
      />
      // {/* <textarea
      //   disabled
      //   value={draftToHtml(convertToRaw(editorState.getCurrentContent()))}
      // /> */}

    );
  }
}

