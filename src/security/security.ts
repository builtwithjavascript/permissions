import { Permissions } from '../permissions'

/**
 * @name IHasPermissionsArgs
 * @description
 * Interface for the arguments required to check permissions.
 * It includes the user or role ID, domain, and the type of permission to check.
 * @interface IHasPermissionsArgs
 * @property {string} id - The ID of user or role.
 * @property {string} domain - The domain for which to check permissions.
 * @property {number} permissionType - The type of permission to check.
 * @see ISecurity
 * @see IPermissionsInfo
 */
export interface IHasPermissionsArgs {
  id: string
  domain: string
  permissionType: number
}

/**
 * @name IPermissionsInfo
 * @description
 * Interface for the permissions information associated with a user or role.
 * It includes the ID and a map of permissions for different domains.
 * @interface IPermissionsInfo
 * @property {string} id - The ID of the user or role.
 * @property {Object} permissions - A map of domain names to permission values.
 * @property {number} permissions[domain] - The permission value for the specified domain.
 * @see ISecurity
 * @see IHasPermissionsArgs
 */
export interface IPermissionsInfo {
  id: string
  permissions: { [key: string]: number }
}

/**
 * @name ISecurity
 * @description
 * Interface for the security service that manages user permissions.
 * It provides methods to add permissions information and check if a user has specific permissions.
 * @interface ISecurity
 * @property {function} addPermissionsInfo - Method to add permissions information for a user or role.
 * @property {function} hasPermissions - Method to check if a user has specific permissions on a domain.
 * @see IHasPermissionsArgs
 * @see IPermissionsInfo
 * @see Permissions
 */
export interface ISecurity {
  addPermissionsInfo(params: IPermissionsInfo): void
  hasPermissions(params: IHasPermissionsArgs): boolean
}

/**
 * @name Security
 * @description
 * The Security class provides methods and utilities for managing and enforcing
 * application security policies, such as authentication, authorization, and permission checks.
 *
 * This class can be used to verify user credentials, manage user roles, and ensure that
 * sensitive operations are only accessible to authorized users. It may also include
 * utilities for handling encryption, token validation, and other security-related tasks.
 * @implements {ISecurity}
 * @see IHasPermissionsArgs
 * @see IPermissionsInfo
 * @see Permissions
 * @example
 * const security = new Security();
 * security.addPermissionsInfo({
 *   id: 'user123',
 *   permissions: {
 *     Items: Permissions.fromKeys(['View', 'Add']),
 *     Accounts: Permissions.fromKeys(['View'])
 *   }
 * });
 * const hasViewPermission = security.hasPermissions({
 *   id: 'user123',
 *   domain: 'Items',
 *   permissionType: Permissions.PermissionType.View
 * });
 * console.log(hasViewPermission); // true
 */
export class Security implements ISecurity {
  private dataMap: Map<string, { [key: string]: number }> = new Map<string, { [key: string]: number }>()

  constructor() {}

  addPermissionsInfo(params: IPermissionsInfo) {
    this.dataMap.set(params.id, params.permissions)
  }

  hasPermissions(params: IHasPermissionsArgs): boolean {
    const { id, domain, permissionType } = params

    // if our lookup contains data for this user
    if (this.dataMap.has(id)) {
      // get the user permissions for all domains
      const domainsPermissions = this.dataMap.get(id)
      // if has permissions on this domain
      if (domainsPermissions && domainsPermissions[domain]) {
        // check permissions for the specific domain
        const value: number = domainsPermissions[domain]
        return Permissions.hasPermission(permissionType, value)
      }
    }

    return false
  }
}
