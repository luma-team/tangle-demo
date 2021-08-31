# Tangle

Tangle is a super simple, performant, event driven state library for React.

This repo includes a full implementation of Tangle with an example.

## Demo

![Tangle Example](https://cdn.lu.ma/blog/tangle.gif)

You can see the demo here: [https://tangle-demo.luma-dev.com/](https://tangle-demo.luma-dev.com/)

This demo shows that while you render hundreds of cells that are changing every 10 ms, this does not make the user input slow. If we implemented this the traditional React way where we have to rerender the whole page on every change, this would be really slow...
