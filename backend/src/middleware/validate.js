export function validate(location, schema) {
  return (req, res, next) => {
    const result = schema.safeParse(req[location]);
    if (!result.success) {
      return res.status(400).json({
        error: {
          message: 'Please check the submitted information.',
          details: result.error.issues.map(({ path, message }) => ({ path: path.join('.'), message })),
        },
      });
    }

    req.validated ??= {};
    req.validated[location] = result.data;
    return next();
  };
}