const ctrlWrapper = (ctrl) => {
  const wrap = async (req, res, next) => {
    try {
      await ctrl(req, res, next);
    } catch (error) {
      next(error);
    }
  };
  return wrap;
};

export default ctrlWrapper;
