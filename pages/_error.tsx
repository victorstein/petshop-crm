import { Component } from 'react'
import Router from 'next/router'

export default class _error extends Component {
  async componentDidMount(): Promise<void> {
    await Router.push('/')
  }

  render(): JSX.Element {
    return <div />
  }
}
