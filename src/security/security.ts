import { Permissions } from '../permissions'

export interface HasPermissionsArgs {
  id: string
  domain: string
  permissionType: number
}

export interface PermissionsInfo {
  id: string
  permissions: { [key: string]: number }
}

export interface ISecurity {
  addPermissionsInfo(params: PermissionsInfo): void
  hasPermissions(params: HasPermissionsArgs): boolean
}

/**
 * @name Security
 * @description
 * Implements the ISecurity. This will hold a lookup to each user permissions by domain.
 * The data has to be added through the addPermissionsInfo after the user logs in your app.
 * You can then use the hasPermissions method to check if a user has a specific permission on a specific domain.
 */
export class Security implements ISecurity {
  private dataMap: Map<string, { [key: string]: number }> = new Map<string, { [key: string]: number }>()

  constructor() {}

  addPermissionsInfo(params: PermissionsInfo) {
    this.dataMap.set(params.id, params.permissions)
  }

  hasPermissions(params: HasPermissionsArgs): boolean {
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
