# Examples

## Create

To create this project, the following commands were used:

```shell
npx create-nx-workspace --preset=express examples
```

Then name the application: `examples-ws`

## Purpose

This simple project runs an Express Web Service and demonstates how to test a game.

## Project Layout

* `apps/example-ws` - a game web service
* `apps/example-ws-e2e` - a test case for verifying the game service end-points.
* `games` - A typescript library for game definitions

## Running

Run the server:
`nx serve example-ws`

Run the unit tests:
`nx test games`

Run the End-to-End (e2e) tests. (Make sure the server is running)
`nx test example-ws-e2e`
