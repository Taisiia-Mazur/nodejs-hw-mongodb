const filterType = (type) => {
  const isString = typeof type === 'string';
  if (!isString) return;
  const isType = (type) => ['work', 'home', 'personal'].includes(type);

  if (isType(type)) return type;
};

const filterIsFavorite = (param) => {
  const isString = typeof param === 'string';

  if (!isString) return;

  const isBoolean = ['true', 'false'].includes(param);

  if (isBoolean) return param;
};

export const parseFilterParams = (query) => {
  const { contactType, isFavourite } = query;

  const parsedType = filterType(contactType);
  const parsedFavorite = filterIsFavorite(isFavourite);

  return {
    type: parsedType,
    isFavourite: parsedFavorite,
  };
};
