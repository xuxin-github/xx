import ReactZmage from 'react-zmage';
import React from 'react';
const baseurl = "http://123.206.221.189:8088/fd-mid/common/file/readpath?img=";
class Smage extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  render() {
    const {src,style,className} = this.props;
    return (
      <ShowZmage style={style} className={className} src={src}></ShowZmage> 
    );
  }
}

export default Smage;

//构建数据
function ShowZmage(props){
  let {src,style,className} = props;
  style = style||{};
  style.width=style.width||100;
  style.height=style.height||100;
  style.marginBottom=style.marginBottom||5;
  style.marginRight=style.marginRight||5;
  style.borderRadius=style.borderRadius||4;
  let srcRef = <div style={style||""}><span style={{color:"red"}}></span></div>;
  if ((src instanceof Array)) {
    if(src.length==1){
      return <ReactZmage style={style||""} className={className||""} src={baseurl+src[0]}></ReactZmage>
    }
    let srcRefSet = [];
    for(var i=0;i<src.length;i++){
      srcRefSet.push({
        src: baseurl+src[i],
        alt: baseurl+src[i]
      });
    }
    let srcRefSetShow=srcRefSet;
    srcRef = srcRefSet.map((item,index)=> (   
      <ReactZmage style={style||""} className={className||""} defaultPage={index} set={srcRefSetShow} src={item.src}></ReactZmage>
    ))
    return <div>{srcRef}</div>
  }else{
    if(src!=null&&src!=undefined&&src!=NaN&&src!=""){
      return <ReactZmage style={style||""} className={className||""} src={baseurl+src}></ReactZmage>;
    }
  }
  return srcRef;
}