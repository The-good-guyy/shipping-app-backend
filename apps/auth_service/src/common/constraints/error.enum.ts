export enum EErrorCode {
  INTERNAL_SERVER_ERROR = 'Internal Server',
  UNAUTHORIZED_ERROR = 'Unauthorized',
  BAD_REQUEST_ERROR = 'Bad Request',
}

export enum EErrorStatusCode {
  INTERNAL_SERVER_ERROR = 500,
  UNAUTHORIZED_ERROR = 401,
  BAD_REQUEST_ERROR = 400,
}

export enum EErrorMessage {
  // Entity errors
  ENTITY_NOT_FOUND = 'entity not found',
  ENTITY_EXISTED = 'entity is already existed',

  // Token errors
  TOKEN_USED = 'token is used',
  TOKEN_EXPIRED = 'token is expired',

  // User errors
  USER_NOT_FOUND = 'user not found',
  USER_UNAUTHORIZED = 'user is not authorized',
  USER_PASSWORD_INVALID = 'password is invalid',
  USER_ROLE_NOT_FOUND = 'user role not found',
  USER_PERMISSION_NOT_FOUND = 'user permission not found',
  USER_DEACTIVATED = 'user was deactivated. Please contact admin',
  USER_DEACTIVATED_ALREADY = 'user was deactivated already',
  USER_ACTIVATED_ALREADY = 'user is active',
  USER_LOGIN_INVALID = 'account or password is invalid. Please check again',
  USER_LOGIN_DEFAULT_TYPE_INVALID = 'this account only can login by using Google',
  USER_LOGIN_GOOGLE_TYPE_INVALID = 'this account only can login by using password',

  // Role errors
  SOME_ROLES_NOT_FOUND = 'some roles not found',
  DEFAULT_ROLE_NOT_ALLOW_TO_UPDATE = 'default role is not allowed to update',

  // Permission errors
  SOME_PERMISSIONS_NOT_FOUND = 'some permissions not found',

  // Other errors
  EMAIL_INVALID = 'email is invalid',
  EMAIL_EXISTED = 'email is already existed',
  CONTACT_ADMIN = 'something went wrong. Please contact admin for more detail',
  EMAIL_TEMPLATE_NOT_FOUND = 'email template not found',
  DATA_LOADERS_NOT_LOAD = 'Data loaders can not be loaded in context',
}
