export function createRequestHandler(response) {
  return (req, res, ctx) => {
    return res(
      ctx.json({
        ...response,
      }),
    )
  }
}

export function createRequestHandlerWithError(response) {
  return (req, res, ctx) => {
    return res(ctx.status(422), ctx.json({ ...response }))
  }
}
