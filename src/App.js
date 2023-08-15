import React, { useEffect, useState } from 'react'
import axios from 'axios'
import san from './img/san.jpg'
import ysz from './img/ysz.jpg'
import love from './img/love.gif'

export default function App() {
  const [hitokoto, setHitokoto] = useState('')

  useEffect(() => {
    axios({
      url: 'https://v1.hitokoto.cn',
      method: 'get',
      params: {
        c: 'a'
      }
    }).then(res =>
      setHitokoto(`${res.data.hitokoto} \n\t\t\t\t\t\t\t--《${res.data.from}》`)
    )
  }, [])

  const handleClick = () => {
    axios({
      url: 'https://v1.hitokoto.cn',
      method: 'get',
      params: {
        c: 'a'
      }
    }).then(res =>
      setHitokoto(`${res.data.hitokoto} \n\t\t\t\t\t\t\t--《${res.data.from}》`)
    )
  }

  return (
    <div>
      <div style={{ whiteSpace: 'pre', marginTop: 100, display: 'flex', justifyContent: 'center' , fontSize:40}}>
        {hitokoto}
      </div>
      <div style={{ marginTop: 100, display: 'flex', justifyContent: 'center' }}>
        <img src={ysz} style={{ width: 400, height: 400 }} />
        <img src={love} style={{ width: 400, height: 400 }} onClick={handleClick}/>
        <img src={san} style={{ width: 400, height: 400 }} />
      </div>
    </div>
  )
}
