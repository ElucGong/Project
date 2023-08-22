import React from 'react'

import './App.css'
import { Swiper } from 'antd-mobile'
import scene1 from './img/scene1.jpg'
import scene2 from './img/scene2.jpg'
import scene3 from './img/scene3.jpg'
import scene4 from './img/scene4.jpg'

const imgs = [scene1, scene2, scene3, scene4]

const items = imgs.map((item, index) => (
    <Swiper.Item key={index}>
        <img src={item} style={{ width: '100%' }} alt='img' />
    </Swiper.Item>
))

export default function Homepage() {
    return (
        <div style={{width: '100%'}}>
            <Swiper
                loop
                autoplay
                autoplayInterval={4000}
            >
                {items}
            </Swiper>
        </div>
    )
}