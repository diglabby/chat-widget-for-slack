// import Vue from 'vue'
// import HelloWorld from '@/components/HelloWorld'

// describe('HelloWorld.vue', () => {
  // it('should render correct contents', () => {
    // const Constructor = Vue.extend(HelloWorld)
    // const vm = new Constructor().$mount()
    // expect(vm.$el.querySelector('.hello h1').textContent)
      // .toEqual('Welcome to Your Vue.js App')
  // })
// })
//import Vue from 'vue'

import {utils} from '@/helpers/utils.js'

describe('utils.js', () => {
  it('should render correct contents', () => {    
    expect(utils.formatTime(1516997686))
      .toBe('22:14:46')
  })
})