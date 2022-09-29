import React, { useState } from 'react';
import { PlayButton, PauseButton, ForwardButton, ReverseButton,
   ElapsedTimeValue, ElapsedTimeRange } from 'harmoware-vis';
import { Text3dDataInput } from './text-3d-data-input';

export default class Controller extends React.Component {
  onClick(buttonType){
    const { viewState, updateViewState } = this.props;
    switch (buttonType) {
      case 'zoom-in': {
        updateViewState({...viewState, zoom:(viewState.zoom+0.25), transitionDuration: 100,})
        break
      }
      case 'zoom-out': {
        updateViewState({...viewState, zoom:(viewState.zoom-0.25), transitionDuration: 100,})
        break
      }
      case 'reset': {
        updateViewState({
          target: [0, 0, 0],
          rotationX: 5,
          rotationOrbit: -5,
          zoom: 3,
          transitionDuration: 200,
        })
        break
      }
    }
  }

  setClusterNum(e){
    const { setClusterNum } = this.props;
    setClusterNum(+e.target.value)
  }

  setTextSiza(e){
    const { setTextSiza } = this.props;
    setTextSiza(+e.target.value)
  }

  render() {

    const { actions, inputFileName, animatePause, animateReverse, leading,
      settime, timeBegin, timeLength, clusterNum, textSiza } = this.props;
    const { text3dDataFileName } = inputFileName;

    return (
        <div className="harmovis_controller">
            <ul className="flex_list">
            <li className="flex_row">
                <div className="harmovis_input_button_column" title='3D object data selection'>
                <label htmlFor="Text3dDataInput">
                3D text data selection<Text3dDataInput actions={actions} id="Text3dDataInput"/>
                </label>
                <div>{text3dDataFileName}</div>
                </div>
            </li>
            <li className="flex_row">
              {animatePause ?
                <PlayButton actions={actions} />:<PauseButton actions={actions} />
              }&nbsp;
              {animateReverse ?
                <ForwardButton actions={actions} />:<ReverseButton actions={actions} />
              }
            </li>
            <li className="flex_row">
              <button onClick={this.onClick.bind(this,'zoom-in')} className='harmovis_button'>＋</button>
              <button onClick={this.onClick.bind(this,'zoom-out')} className='harmovis_button'>－</button>
              <button onClick={this.onClick.bind(this,'reset')} className='harmovis_button'>RESET</button>
            </li>
            <li className="flex_row">
              <label htmlFor="ElapsedTimeValue">elapsedTime</label>
              <ElapsedTimeValue settime={settime} timeBegin={timeBegin} timeLength={timeLength} actions={actions}
              min={leading*-1} id="ElapsedTimeValue" />
            </li>
            <li className="flex_row">
              <ElapsedTimeRange settime={settime} timeLength={timeLength} timeBegin={timeBegin} actions={actions}
              min={leading*-1} style={{'width':'100%'}} />
            </li>
            <li className="flex_row">
            <label htmlFor="setClusterNum">Cluster Number</label>
              <input type="range" value={clusterNum} min={1} max={10} step={1} onChange={this.setClusterNum.bind(this)}
                className='harmovis_input_range' id='setClusterNum' title={clusterNum}/>
            </li>
            <li className="flex_row">
            <label htmlFor="setTextSiza">{`Text Size : `}</label>
              <input type="range" value={textSiza} min={0} max={20} step={0.2} onChange={this.setTextSiza.bind(this)}
                className='harmovis_input_range' id='setTextSiza' title={clusterNum}/>
            </li>
            </ul>
            <TransformController/>
        </div>
    );
  }
}
const TransformController = (props)=>{
  let style = {top:'',left:''}
  let transform = ''
  const [rotate,setRotate] = useState(0)
  const [scaleX,setScaleX] = useState(1)
  const [scaleY,setScaleY] = useState(1)
  const [top,setTop] = useState(0)
  const [left,setLeft] = useState(0)
  const select = document.getElementsByClassName('select')[0]
  if(select){
    style = select.style
    transform = select.style.transform
  }

  React.useEffect(()=>{
    if(style.top.includes('px')){
      const value = parseFloat(style.top.match(/-{0,1}[0-9.]+/g)[0])
      setTop(value|0)
    }else{
      setTop(0)
    }
  },[style.top])

  React.useEffect(()=>{
    if(style.left.includes('px')){
      const value = parseFloat(style.left.match(/-{0,1}[0-9.]+/g)[0])
      setLeft(value|0)
    }else{
      setLeft(0)
    }
  },[style.left])

  React.useEffect(()=>{
    if(transform.includes('rotate')){
      const rotate = transform.match(/rotate\(-{0,1}[0-9.]+deg\)/g)[0]
      const value = parseFloat(rotate.match(/-{0,1}[0-9.]+/g)[0])
      setRotate(value|0)
    }else{
      setRotate(0)
    }
    if(transform.includes('scaleX')){
      const scaleX = transform.match(/scaleX\(-{0,1}[0-9.]+\)/g)[0]
      const value = parseFloat(scaleX.match(/-{0,1}[0-9.]+/g)[0])
      setScaleX(value)
    }else{
      setScaleX(1)
    }
    if(transform.includes('scaleY')){
      const scaleY = transform.match(/scaleY\(-{0,1}[0-9.]+\)/g)[0]
      const value = parseFloat(scaleY.match(/-{0,1}[0-9.]+/g)[0])
      setScaleY(value)
    }else{
      setScaleY(1)
    }
  },[transform])

  const onChangeRotate = (e)=>{
    const value = +e.target.value;
    setRotate(value)
    select.style.transform = `rotate(${value}deg) scaleX(${scaleX})  scaleY(${scaleY})`
  }

  const onChangeScaleX = (e)=>{
    const value = +e.target.value;
    setScaleX(value)
    select.style.transform = `rotate(${rotate}deg) scaleX(${value})  scaleY(${scaleY})`
  }

  const onChangeScaleY = (e)=>{
    const value = +e.target.value;
    setScaleY(value)
    select.style.transform = `rotate(${rotate}deg) scaleX(${scaleX})  scaleY(${value})`
  }

  const onChangeTop = (e)=>{
    const value = +e.target.value;
    setTop(value)
    select.style.top = `${value}px`
  }

  const onChangeLeft = (e)=>{
    const value = +e.target.value;
    setLeft(value)
    select.style.left = `${value}px`
  }

  return (<>{select === undefined ? null:
    <ul className="flex_list">
      <li className="flex_row">Image Item Control</li>
      <li className="flex_row">{`${select.title}`}</li>
      <li className="flex_row">
        <label htmlFor="top">{`top :`}</label>
        <input type="range" value={top|0}
          min={0} max={window.innerHeight} step={1} onChange={onChangeTop}
          className="harmovis_input_range" id="top" />
        {`: ${top|0}px`}
      </li>
      <li className="flex_row">
        <label htmlFor="left">{`left :`}</label>
        <input type="range" value={left|0}
          min={0} max={window.innerWidth} step={1} onChange={onChangeLeft}
          className="harmovis_input_range" id="left" />
        {`: ${left|0}px`}
      </li>
      <li className="flex_row">
        <label htmlFor="rotate">{`rotate :`}</label>
        <input type="range" value={rotate|0}
          min={-180} max={180} step={1} onChange={onChangeRotate}
          className="harmovis_input_range" id="rotate" />
        {`: ${rotate|0} °`}
      </li>
      <li className="flex_row">
        <label htmlFor="scaleX">{`scaleX :`}</label>
        <input type="range" value={scaleX}
          min={0} max={2} step={1/select.width} onChange={onChangeScaleX}
          className="harmovis_input_range" id="scaleX" />
        {`: ${Math.round(scaleX*select.width)}px`}
      </li>
      <li className="flex_row">
        <label htmlFor="scaleY">{`scaleY :`}</label>
        <input type="range" value={scaleY}
          min={0} max={2} step={1/select.height} onChange={onChangeScaleY}
          className="harmovis_input_range" id="scaleY" />
        {`: ${Math.round(scaleY*select.height)}px`}
      </li>
    </ul>
    }</>
  )
}