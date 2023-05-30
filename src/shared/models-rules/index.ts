import { AppRequest } from '../interfaces';

/**
 * @param {AppRequest} request
 * @returns {string}
 */
export function getUserIdFromRequest(request: AppRequest): string {
  return (request.user && request.user?.dataValues.id) || '';
}
