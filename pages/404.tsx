import { Component } from 'react'
import Router from 'next/router'

export default class Error404 extends Component {
  async componentDidMount(): Promise<void> {
    await Router.push('/')
  }

  render(): JSX.Element {
    return <div />
  }
}
