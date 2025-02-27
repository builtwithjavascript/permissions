import { IPermissionType, PermissionType } from './permission-type'

/**
 * @name IPermissionsStatic
 * @description
 * TypeScript trick to declare methods for static classes through interface
 */
export interface IPermissionsStatic {
  hasPermission(permissionType: number, permissions: number): boolean
  extendTypes(names: string[]): IPermissionType
}

export interface IPermissions {}

/**
 * @name Permissions
 * @description
 * Export our static Permissions instance
 */
export const Permissions: IPermissionsStatic = class implements IPermissions {
  public static hasPermission(permissionType: number, permissions: number): boolean {
    return permissionType === (permissions & permissionType)
  }

  /**
   * @name extendTypes
   * @description
   * Extends IPermissionType with additional properties with the correct values
   * @param names The names of the new permission types to add
   */
  public static extendTypes(names: string[]): IPermissionType {
    // create an empty dictionary where to add additional custom permissions
    const additionalPermissions: { [key: string]: number } = {}

    // get keys
    const keys: string[] = Object.keys(PermissionType)
    // check if base zero
    const firstValue = (<any>PermissionType)[keys[0]]

    let factor = Object.keys(PermissionType).length
    if (firstValue === 0) {
      factor -= 1
    }

    // assign values to each new permission type
    names.forEach((name) => [
      // double previous value
      (additionalPermissions[name] = Math.pow(2, factor++))
    ])

    // create union of both current PermissionType and the additionalPermissions
    const unionPermissionType: IPermissionType = Object.freeze({
      ...PermissionType,
      ...additionalPermissions
    } as IPermissionType)

    return unionPermissionType
  }
}
