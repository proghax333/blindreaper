
export default function AuthController(modules) {
  const {} = modules;

  return {
    "/": async (req, res, next) => {
      return res.send({
        status: "Done!"
      });
    }
  };
}
